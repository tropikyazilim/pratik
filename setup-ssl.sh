#!/bin/bash

# SSL Sertifikası Kurulum Scripti
# VPS'de çalıştırın

echo "🔐 SSL Sertifikası kurulumu başlatılıyor..."

# E-mail adresini güncelle
EMAIL="volkankok@gmail.com"
DOMAIN="pratik.volkankok.dev"

echo "📧 E-mail adresi: $EMAIL"
echo "🌐 Domain: $DOMAIN"

# Önce HTTP-only modda başlat (SSL sertifikası olmadan)
echo "🚀 Önce HTTP modunda başlatılıyor..."

# Nginx konfigürasyonunu geçici olarak HTTP-only yap
cp nginx/sites-available/pratik.conf nginx/sites-available/pratik.conf.backup

cat > nginx/sites-available/pratik-temp.conf << 'EOF'
server {
    listen 80;
    server_name pratik.volkankok.dev;

    # Let's Encrypt için
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
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

# Geçici konfigürasyonu kullan
mv nginx/sites-available/pratik.conf nginx/sites-available/pratik-ssl.conf
mv nginx/sites-available/pratik-temp.conf nginx/sites-available/pratik.conf

# Container'ları başlat (SSL olmadan)
docker compose up -d nginx frontend backend database

echo "⏳ Nginx'in hazır olması bekleniyor..."
sleep 30

# SSL sertifikası al
echo "📜 SSL sertifikası alınıyor..."
docker compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN

# SSL konfigürasyonunu geri yükle
echo "🔧 SSL konfigürasyonu aktifleştiriliyor..."
mv nginx/sites-available/pratik.conf nginx/sites-available/pratik-temp.conf
mv nginx/sites-available/pratik-ssl.conf nginx/sites-available/pratik.conf

# Nginx'i yeniden başlat
docker compose restart nginx

echo "✅ SSL kurulumu tamamlandı!"
echo "🌐 Site erişilebilir: https://pratik.volkankok.dev"

# Otomatik yenileme için cron job ekle
echo "⏰ SSL otomatik yenileme ayarlanıyor..."
echo "0 12 * * * cd $(pwd) && docker compose run --rm certbot renew && docker compose restart nginx" | crontab -

echo "🎉 Kurulum başarıyla tamamlandı!"
