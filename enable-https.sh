#!/bin/bash

# HTTPS Konfigürasyonu Aktifleştirme

echo "🔐 HTTPS konfigürasyonunu aktifleştiriyorum..."

# SSL sertifikası var mı kontrol et
echo "📜 SSL sertifikası kontrolü:"
docker compose exec nginx ls -la /etc/letsencrypt/live/pratik.volkankok.dev/ || echo "SSL sertifikası bulunamadı"

# HTTPS konfigürasyonu oluştur
cat > nginx/sites-available/pratik.conf << 'EOF'
# HTTP -> HTTPS yönlendirme
server {
    listen 80;
    server_name pratik.volkankok.dev;
    
    # Let's Encrypt için
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    # Diğer tüm istekleri HTTPS'e yönlendir
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS sunucusu
server {
    listen 443 ssl;
    server_name pratik.volkankok.dev;

    # SSL sertifikaları
    ssl_certificate /etc/letsencrypt/live/pratik.volkankok.dev/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/pratik.volkankok.dev/privkey.pem;

    # SSL güvenlik ayarları
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;

    # Backend API proxy
    location /api/ {
        proxy_pass http://pratik_backend:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend
    location / {
        proxy_pass http://pratik_frontend:80/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

echo "✅ HTTPS konfigürasyonu oluşturuldu"

# Nginx'i yeniden başlat
echo "🔄 Nginx yeniden başlatılıyor..."
docker compose restart nginx

# Durum kontrol
sleep 10
echo "📊 Container durumları:"
docker compose ps

# HTTPS test
echo "🧪 HTTPS test:"
curl -I https://pratik.volkankok.dev || echo "HTTPS henüz hazır değil"

# HTTP yönlendirme test
echo "🔄 HTTP -> HTTPS yönlendirme test:"
curl -I http://pratik.volkankok.dev || echo "HTTP yönlendirme test başarısız"

echo "🎉 HTTPS kurulumu tamamlandı!"
echo "🌐 Site: https://pratik.volkankok.dev"
