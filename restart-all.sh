#!/bin/bash

# Container Durum Kontrolü ve Yeniden Başlatma

echo "🔍 Container durumları kontrol ediliyor..."

# Container durumlarını kontrol et
echo "📊 Mevcut container durumları:"
docker compose ps

echo ""
echo "🔍 Çalışan tüm container'lar:"
docker ps

echo ""
echo "🚀 Tüm servisleri yeniden başlatıyorum..."

# Tüm servisleri durdur
docker compose down

# Tüm servisleri başlat
docker compose up -d

echo ""
echo "⏳ Container'ların başlaması bekleniyor..."
sleep 30

echo ""
echo "📊 Yeni container durumları:"
docker compose ps

echo ""
echo "🔌 Port kontrolleri:"
echo "Port 80:"
netstat -tlnp | grep :80
echo "Port 443:"
netstat -tlnp | grep :443

echo ""
echo "🧪 Site erişim testleri:"
echo "HTTP test:"
curl -I http://pratik.volkankok.dev 2>/dev/null || echo "❌ HTTP erişim başarısız"

echo "HTTPS test:"
curl -I https://pratik.volkankok.dev 2>/dev/null || echo "❌ HTTPS erişim başarısız"

echo ""
echo "📋 Nginx logları:"
docker compose logs nginx --tail=10

echo ""
echo "📋 Backend logları:"
docker compose logs backend --tail=10

echo ""
echo "✅ Container restart işlemi tamamlandı!"
echo "🌐 Site durumu:"
if docker compose ps | grep -q "Up"; then
    echo "✅ Container'lar çalışıyor"
    if curl -s -I http://pratik.volkankok.dev >/dev/null 2>&1; then
        echo "✅ Site erişilebilir: http://pratik.volkankok.dev"
    elif curl -s -I https://pratik.volkankok.dev >/dev/null 2>&1; then
        echo "✅ Site erişilebilir: https://pratik.volkankok.dev"
    else
        echo "❌ Site erişilemiyor"
    fi
else
    echo "❌ Container'lar hala sorunlu"
fi
