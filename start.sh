# VPS'de Çalıştırma Scripti
#!/bin/bash

echo "🚀 Pratik uygulaması başlatılıyor..."

# Docker Compose ile servisleri başlat
docker compose up -d

echo "✅ Servisler başlatıldı!"
echo ""
echo "📊 Servis durumları:"
docker compose ps

echo ""
echo "🌐 Erişim adresleri:"
echo "Frontend: http://your-vps-ip"
echo "Backend API: http://your-vps-ip:3000"
echo ""
echo "📋 Logları izlemek için:"
echo "docker compose logs -f [service_name]"
