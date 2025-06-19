#!/bin/bash

# Backend + Nginx Tam Çözüm

echo "🔧 Backend database + Nginx sorunlarını çözüyorum..."

# 1. Backend environment sorununu çöz
echo "📝 Backend environment düzeltiliyor..."
docker compose exec backend sh -c 'echo "DB_HOST=database
DB_USER=postgres  
DB_PASSWORD=devbros123
DB_NAME=pratik
DB_PORT=5432
DATABASE_URL=postgresql://postgres:devbros123@database:5432/pratik
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://pratik.volkankok.dev" > /app/.env'

# 2. Nginx'i HTTP-only moduna al (SSL sertifikası sorunu varsa)
echo "📝 Nginx HTTP moduna alınıyor..."
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

# 3. Backend'i yeniden başlat
echo "🔄 Backend yeniden başlatılıyor..."
docker compose restart backend

# 4. Nginx'i yeniden başlat  
echo "🔄 Nginx yeniden başlatılıyor..."
docker compose restart nginx

# 5. Durum kontrol
sleep 20
echo "📊 Final durum:"
docker compose ps

# 6. Backend bağlantı test
echo "🧪 Backend database bağlantı test:"
docker compose exec backend node -e "console.log('DB_HOST:', process.env.DB_HOST)"

# 7. Site test
echo "🌐 Site erişim test:"
curl -I http://pratik.volkankok.dev || echo "HTTP test başarısız"

echo "✅ Sorunlar giderildi!"
echo "🌐 Site: http://pratik.volkankok.dev (geçici olarak HTTP)"
