#!/bin/bash

# DNS Challenge ile SSL Kurulum Scripti

echo "🔐 DNS Challenge ile SSL kurulumu..."

# Container'ları durdur
docker compose down

# DNS challenge için certbot çalıştır
echo "📋 DNS challenge başlatılıyor..."
echo "⚠️  DNS TXT kaydı eklemeniz gerekecek!"

docker compose run --rm -it certbot certonly \
    --manual \
    --preferred-challenges dns \
    --email volkankok@gmail.com \
    --agree-tos \
    --no-eff-email \
    -d pratik.volkankok.dev

echo "✅ DNS challenge tamamlandı"

# SSL konfigürasyonunu aktifleştir
docker compose up -d

echo "🎉 SSL kurulumu tamamlandı!"
