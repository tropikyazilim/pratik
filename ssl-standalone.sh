#!/bin/bash

# Standalone Mode SSL Kurulum

echo "🔐 Standalone mode SSL kurulumu..."

# Tüm container'ları durdur (port 80 boşaltmak için)
docker compose down

# Standalone mode ile sertifika al
docker run --rm -it \
    -v ssl_certs:/etc/letsencrypt \
    -p 80:80 \
    certbot/certbot certonly \
    --standalone \
    --email volkankok@gmail.com \
    --agree-tos \
    --no-eff-email \
    -d pratik.volkankok.dev

echo "✅ Standalone SSL tamamlandı"

# Container'ları tekrar başlat
docker compose up -d

echo "🎉 SSL kurulumu tamamlandı!"
