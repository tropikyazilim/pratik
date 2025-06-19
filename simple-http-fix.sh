#!/bin/bash

echo "=== HTTP-ONLY BASIT ÇÖZÜM ==="

# Nginx'i basit HTTP-only config ile yeniden başlat
cat > nginx/sites-available/pratik-simple.conf << 'EOF'
server {
    listen 80;
    server_name pratik.volkankok.dev;

    location / {
        proxy_pass http://frontend:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /api/ {
        proxy_pass http://backend:3000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF

# Nginx main config'i basitleştir
cat > nginx/nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    sendfile on;
    keepalive_timeout 65;

    include /etc/nginx/sites-available/pratik-simple.conf;
}
EOF

echo "Nginx config basitleştirildi - HTTPS kaldırıldı"
echo "Container'ları yeniden başlatıyor..."

docker compose restart nginx

echo "Site test ediliyor..."
sleep 10
curl -I http://pratik.volkankok.dev || echo "Hala çalışmıyor"

echo "Nginx logları:"
docker compose logs nginx --tail=10
