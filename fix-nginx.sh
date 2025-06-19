#!/bin/bash

# Nginx Sorun Giderme Scripti

echo "🔧 Nginx sorununu gideriyorum..."

# Nginx loglarını göster
echo "📋 Nginx logları:"
docker compose logs nginx --tail=20

# Nginx container'ı durdur
echo "⏹️ Nginx container'ını durduruyor..."
docker compose stop nginx

# HTTP-only basit konfigürasyon oluştur
echo "📝 Basit HTTP konfigürasyonu oluşturuluyor..."

# Mevcut konfigürasyonu yedekle
cp nginx/sites-available/pratik.conf nginx/sites-available/pratik-ssl.conf.backup 2>/dev/null || true

# Basit HTTP-only konfigürasyon
cat > nginx/sites-available/pratik.conf << 'EOF'
server {
    listen 80;
    server_name pratik.volkankok.dev;

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

# Nginx'i yeniden başlat
echo "🚀 Nginx'i HTTP modunda başlatıyor..."
docker compose start nginx

# Durum kontrol
sleep 10
echo "📊 Container durumları:"
docker compose ps

# Site testi
echo "🧪 Site erişim testi:"
curl -I http://pratik.volkankok.dev

echo "✅ HTTP modunda başlatıldı!"
echo "🌐 Site: http://pratik.volkankok.dev"
