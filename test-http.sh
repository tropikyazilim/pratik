#!/bin/bash

# HTTP Test Scripti

echo "🌐 HTTP modunda test başlatılıyor..."

# SSL konfigürasyonunu yedekle
cp nginx/sites-available/pratik.conf nginx/sites-available/pratik-ssl.conf.backup

# HTTP-only konfigürasyonu oluştur
cat > nginx/sites-available/pratik.conf << 'EOF'
server {
    listen 80;
    server_name pratik.volkankok.dev;

    # Backend API proxy
    location /api/ {
        proxy_pass http://pratik_backend:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Frontend
    location / {
        proxy_pass http://pratik_frontend:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # SPA için try_files
        try_files $uri $uri/ @fallback;
    }

    # SPA fallback
    location @fallback {
        proxy_pass http://pratik_frontend:80/index.html;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

echo "✅ HTTP konfigürasyonu hazırlandı"

# Container'ları başlat
docker compose up -d

echo "⏳ Container'ların hazır olması bekleniyor..."
sleep 30

# Container durumlarını kontrol et
echo "📊 Container durumları:"
docker compose ps

# Site erişim testi
echo "🧪 Site erişim testi:"
curl -I http://pratik.volkankok.dev

echo "✅ HTTP test tamamlandı!"
echo "🌐 Site: http://pratik.volkankok.dev"
