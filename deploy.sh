#!/bin/bash

# VPS Deploy Scripecho "✅ Deploy tamamlandı!"
echo ""
echo "🌐 Erişim adresleri:"
echo "Frontend: https://pratik.volkankok.dev"
echo "Backend API: https://pratik.volkankok.dev/api"
echo ""
echo "📊 Logları izlemek için:"
echo "docker compose logs -f"scripti VPS'de çalıştırın

echo "🚀 VPS'de Deploy işlemi başlatılıyor..."

# Eğer varsa eski container'ları durdur
echo "📦 Eski container'ları durduruluyor..."
docker compose down 2>/dev/null || true

# Images'ları güncelle
echo "🔄 Docker images güncelleniyor..."
docker compose build --no-cache

# Veritabanı volume'unu kontrol et
echo "💾 Veritabanı volume kontrol ediliyor..."
docker volume ls | grep postgres_data || docker volume create postgres_data

# Servisleri başlat
echo "🌟 Servisler başlatılıyor..."
docker compose up -d

# Servislerin hazır olmasını bekle
echo "⏳ Servislerin hazır olması bekleniyor..."
sleep 30

# Sağlık kontrolü
echo "🏥 Sağlık kontrolü yapılıyor..."
docker compose ps

echo "✅ Deploy tamamlandı!"
echo ""
echo "🌐 Erişim adresleri:"
echo "Frontend: http://$(curl -s ifconfig.me || echo '69.62.115.159')"
echo "Backend API: http://$(curl -s ifconfig.me || echo '69.62.115.159'):3000"
echo ""
echo "📊 Logları izlemek için:"
echo "docker compose logs -f"
