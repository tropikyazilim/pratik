#!/bin/bash

# Nginx Direkt Başlatma (Network Test Olmadan)

echo "🚀 Nginx'i direkt başlatıyorum (container network'te backend bulacak)..."

# Nginx'i başlat
docker compose start nginx

# Biraz bekle
sleep 10

# Container durumlarını kontrol et
echo "📊 Container durumları:"
docker compose ps

# Nginx loglarını kontrol et
echo "📋 Nginx logları:"
docker compose logs nginx --tail=10

# Eğer nginx çalışıyorsa site test et
if docker compose ps | grep nginx | grep -q "Up"; then
    echo "✅ Nginx çalışıyor!"
    
    # Site test
    echo "🌐 Site test:"
    curl -I http://pratik.volkankok.dev || echo "Site henüz hazır değil"
    
    # Port kontrolü
    echo "🔌 Port kontrolü:"
    netstat -tlnp | grep :80
    
else
    echo "❌ Nginx hala sorunlu, logları inceleyelim:"
    docker compose logs nginx --tail=20
fi

echo "📝 Özet:"
echo "- Database: $(docker compose ps | grep database | awk '{print $7}')"
echo "- Backend: $(docker compose ps | grep backend | awk '{print $7}')"
echo "- Frontend: $(docker compose ps | grep frontend | awk '{print $7}')"
echo "- Nginx: $(docker compose ps | grep nginx | awk '{print $7}')"
