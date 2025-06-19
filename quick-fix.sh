#!/bin/bash

# Hızlı Nginx + Backend Düzeltme

echo "🔧 Nginx konfigürasyonu düzeltiliyor..."

# Basit HTTP-only nginx konfigürasyonu
cat > nginx/sites-available/pratik.conf << 'EOF'
server {
    listen 80;
    server_name pratik.volkankok.dev;

    location /api/ {
        proxy_pass http://pratik_backend:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://pratik_frontend:80/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

echo "🔧 Backend environment düzeltiliyor..."

# Backend environment zorla düzelt
docker compose exec backend sh -c '
echo "DB_HOST=database
DB_USER=postgres
DB_PASSWORD=devbros123
DB_NAME=pratik
DB_PORT=5432
DATABASE_URL=postgresql://postgres:devbros123@database:5432/pratik
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://pratik.volkankok.dev" > /app/.env
'

echo "🔄 Servisler yeniden başlatılıyor..."

# Nginx ve Backend'i yeniden başlat
docker compose restart nginx backend

# Durum kontrol
sleep 15
echo "📊 Container durumları:"
docker compose ps

echo "📋 Nginx logları:"
docker compose logs nginx --tail=5

echo "📋 Backend logları:"
docker compose logs backend --tail=5

echo "🧪 Site test:"
curl -I http://pratik.volkankok.dev || echo "Site henüz hazır değil"

echo "⚠️  NOT: .dev domainleri HTTPS gerektirir!"
echo "📋 HTTPS'e geçmek için SSL sertifikası kontrol ediliyor..."

# SSL sertifikası var mı kontrol et
if docker compose exec nginx ls /etc/letsencrypt/live/pratik.volkankok.dev/ > /dev/null 2>&1; then
    echo "✅ SSL sertifikası mevcut, HTTPS konfigürasyonu hazırlanıyor..."
    
    # HTTPS konfigürasyonu oluştur
    cat > nginx/sites-available/pratik.conf << 'EOF'
# HTTP -> HTTPS yönlendirme
server {
    listen 80;
    server_name pratik.volkankok.dev;
    return 301 https://$server_name$request_uri;
}

# HTTPS sunucusu
server {
    listen 443 ssl;
    server_name pratik.volkankok.dev;

    ssl_certificate /etc/letsencrypt/live/pratik.volkankok.dev/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/pratik.volkankok.dev/privkey.pem;

    location /api/ {
        proxy_pass http://pratik_backend:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://pratik_frontend:80/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF
    
    # Nginx'i yeniden başlat
    docker compose restart nginx
    sleep 10
    
    echo "🧪 HTTPS test:"
    curl -I https://pratik.volkankok.dev || echo "HTTPS henüz hazır değil"
    
    echo "🎉 Site: https://pratik.volkankok.dev"
else
    echo "❌ SSL sertifikası yok, önce HTTP modunda test edilecek"
    echo "🔐 SSL kurulumu için sonra ssl-standalone.sh çalıştırın"
    echo "🌐 Geçici test: http://pratik.volkankok.dev (tarayıcıda çalışmayacak)"
fi

echo "✅ Hızlı düzeltme tamamlandı!"
