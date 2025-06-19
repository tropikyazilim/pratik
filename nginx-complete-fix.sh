#!/bin/bash

# Nginx Tam Düzeltme Scripti

echo "🔧 Nginx'i tamamen sıfırlayıp basit konfigürasyonla başlatıyorum..."

# Nginx'i durdur
docker compose stop nginx

# Konfigürasyonları yedekle
cp nginx/nginx.conf nginx/nginx.conf.backup 2>/dev/null || true
cp nginx/sites-available/pratik.conf nginx/sites-available/pratik.conf.backup 2>/dev/null || true

# Basit nginx.conf oluştur
cat > nginx/nginx.conf << 'EOF'
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log notice;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    keepalive_timeout 65;

    include /etc/nginx/sites-available/*;
}
EOF

# Basit site konfigürasyonu
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

echo "✅ Basit konfigürasyonlar oluşturuldu"

# Konfigürasyon test et
echo "🧪 Nginx konfigürasyonu test ediliyor..."
docker run --rm \
    -v $(pwd)/nginx/nginx.conf:/etc/nginx/nginx.conf \
    -v $(pwd)/nginx/sites-available:/etc/nginx/sites-available \
    nginx:alpine nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx konfigürasyonu geçerli"
    
    # Nginx'i başlat
    echo "🚀 Nginx başlatılıyor..."
    docker compose start nginx
    
    # Durum kontrol
    sleep 5
    echo "📊 Container durumları:"
    docker compose ps
    
    # Site test
    echo "🧪 Site erişim testi:"
    curl -I http://localhost 2>/dev/null || echo "Localhost test başarısız"
    curl -I http://pratik.volkankok.dev 2>/dev/null || echo "External test başarısız"
    
    echo "🎉 Nginx başarıyla başlatıldı!"
else
    echo "❌ Nginx konfigürasyonu hatalı"
    exit 1
fi
