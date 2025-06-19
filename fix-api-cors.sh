#!/bin/bash

# API URL ve CORS Sorunlarını Düzeltme

echo "🔧 Frontend API URL ve Backend CORS düzeltiliyor..."

# Container'ları durdur
docker compose down

# Frontend'i yeniden build et (yeni .env.production ile)
echo "🔨 Frontend yeniden build ediliyor..."
docker compose build frontend --no-cache

# Backend'i yeniden build et (yeni CORS ayarları ile)
echo "🔨 Backend yeniden build ediliyor..."
docker compose build backend --no-cache

# Tüm container'ları başlat
echo "🚀 Container'lar başlatılıyor..."
docker compose up -d

# Container durumlarını kontrol et
sleep 30
echo "📊 Container durumları:"
docker compose ps

# Backend loglarını kontrol et
echo "📋 Backend logları:"
docker compose logs backend --tail=10

# Site test
echo "🧪 Site testi:"
curl -I https://pratik.volkankok.dev

echo "✅ API URL ve CORS düzeltmeleri tamamlandı!"
echo "🌐 Site: https://pratik.volkankok.dev"
echo "🔗 API: https://pratik.volkankok.dev/api"

echo ""
echo "📝 Test etmek için:"
echo "1. Tarayıcıda https://pratik.volkankok.dev adresine gidin"
echo "2. Network sekmesinde API isteklerini kontrol edin"
echo "3. CORS hatası artık olmamalı"
