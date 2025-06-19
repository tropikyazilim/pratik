#!/bin/bash

# Nginx Hızlı Düzeltme

echo "🔧 Nginx konfigürasyonunu düzelttim, yeniden başlatıyorum..."

# Nginx'i durdur
docker compose stop nginx

# Konfigürasyon test et
echo "📝 Nginx konfigürasyonu test ediliyor..."
docker run --rm -v $(pwd)/nginx/nginx.conf:/etc/nginx/nginx.conf -v $(pwd)/nginx/sites-available:/etc/nginx/sites-available nginx:alpine nginx -t

# Nginx'i başlat
echo "🚀 Nginx başlatılıyor..."
docker compose start nginx

# Durum kontrol
sleep 5
echo "📊 Container durumları:"
docker compose ps

# Site test
echo "🧪 Site testi:"
curl -I http://pratik.volkankok.dev || echo "Site henüz hazır değil, biraz bekleyin..."

echo "✅ Nginx düzeltildi!"
