#!/bin/bash

# SSL Sorun Giderme ve Kurulum Scripti

echo "🔧 SSL sorun giderme başlatılıyor..."

# Mevcut container'ları durdur
echo "⏹️ Container'ları durduruluyor..."
docker compose down

# Geçici HTTP-only Nginx konfigürasyonu oluştur
echo "📝 Geçici HTTP konfigürasyonu oluşturuluyor..."

cat > nginx/sites-available/pratik-temp.conf << 'EOF'
server {
    listen 80;
    server_name pratik.volkankok.dev;

    # Let's Encrypt challenge path
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
        try_files $uri $uri/ =404;
    }

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
        proxy_pass http://pratik_frontend:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# SSL konfigürasyonunu yedekle
if [ -f "nginx/sites-available/pratik.conf" ]; then
    mv nginx/sites-available/pratik.conf nginx/sites-available/pratik-ssl.conf
fi

# Geçici konfigürasyonu aktif et
mv nginx/sites-available/pratik-temp.conf nginx/sites-available/pratik.conf

# Container'ları başlat
echo "🚀 Container'ları HTTP modunda başlatıyor..."
docker compose up -d database backend frontend nginx

# Container'ların hazır olmasını bekle
echo "⏳ Container'ların hazır olması bekleniyor..."
sleep 30

# Nginx durumunu kontrol et
echo "🔍 Nginx durumu kontrol ediliyor..."
docker compose logs nginx --tail=10

# Challenge path'ini test et
echo "🧪 Challenge path test ediliyor..."
docker compose exec nginx mkdir -p /var/www/certbot/.well-known/acme-challenge
echo "test-file" | docker compose exec -T nginx tee /var/www/certbot/.well-known/acme-challenge/test > /dev/null

# Test dosyasına erişim kontrolü
echo "📡 Test dosyası erişim kontrolü..."
curl -I http://pratik.volkankok.dev/.well-known/acme-challenge/test || echo "❌ Challenge path erişilebilir değil"

# Manuel SSL sertifikası alma
echo "🔐 SSL sertifikası manuel olarak alınıyor..."
docker compose run --rm -it certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email volkankok@gmail.com \
    --agree-tos \
    --no-eff-email \
    --verbose \
    -d pratik.volkankok.dev

# Eğer SSL başarılı ise, SSL konfigürasyonunu aktifleştir
if [ -d "/var/lib/docker/volumes/pratik_ssl_certs/_data/live/pratik.volkankok.dev" ] || docker compose exec nginx test -d /etc/letsencrypt/live/pratik.volkankok.dev; then
    echo "✅ SSL sertifikası başarıyla alındı!"
    
    # SSL konfigürasyonunu geri yükle
    echo "🔧 SSL konfigürasyonu aktifleştiriliyor..."
    mv nginx/sites-available/pratik.conf nginx/sites-available/pratik-temp.conf
    mv nginx/sites-available/pratik-ssl.conf nginx/sites-available/pratik.conf
    
    # Nginx'i yeniden başlat
    docker compose restart nginx
    
    echo "🎉 SSL kurulumu tamamlandı!"
    echo "🌐 Site erişilebilir: https://pratik.volkankok.dev"
else
    echo "❌ SSL sertifikası alınamadı. Manuel kontrol gerekli."
    echo "🔍 Logları kontrol edin: docker compose logs certbot"
fi
