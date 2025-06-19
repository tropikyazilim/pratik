#!/bin/bash

# Docker Compose Syntax Test ve Başlatma

echo "🔧 Docker Compose syntax kontrolü..."

# Syntax kontrol
if docker compose config > /dev/null 2>&1; then
    echo "✅ YAML syntax doğru"
else
    echo "❌ YAML syntax hatası:"
    docker compose config
    exit 1
fi

echo "🚀 Container'ları başlatıyor..."

# Container'ları başlat
docker compose down
docker compose up -d

echo "📊 Container durumları:"
docker compose ps

echo "✅ Başlatma tamamlandı!"
