#!/bin/bash

# Hızlı Test ve Düzeltme Scripti

echo "🔧 YAML syntax kontrolü..."

# Docker Compose syntax kontrol
if docker compose config > /dev/null 2>&1; then
    echo "✅ YAML syntax doğru"
else
    echo "❌ YAML syntax hatası var:"
    docker compose config
    exit 1
fi

echo "🚀 Container'ları başlatıyor..."

# Container'ları başlat
docker compose up -d

echo "⏳ Container'ların hazır olması bekleniyor..."
sleep 30

# Container durumlarını kontrol et
echo "📊 Container durumları:"
docker compose ps

# Nginx loglarını kontrol et
echo "📋 Nginx logları:"
docker compose logs nginx --tail=20

echo "✅ Test tamamlandı!"
echo "🌐 Site kontrolü: curl -I http://localhost"
