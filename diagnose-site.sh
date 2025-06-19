#!/bin/bash

# Site Sorun Giderme ve Başlatma Scripti

echo "🔍 Site erişim sorununu gideriyorum..."

# Container durumlarını kontrol et
echo "📊 Container durumları:"
docker compose ps

# Eğer container'lar down ise başlat
if ! docker compose ps | grep -q "Up"; then
    echo "⚠️  Container'lar çalışmıyor, başlatılıyor..."
    docker compose down
    docker compose up -d
    sleep 30
fi

# Container loglarını kontrol et
echo "📋 Nginx logları:"
docker compose logs nginx --tail=10

echo "📋 Backend logları:"
docker compose logs backend --tail=10

echo "📋 Frontend logları:"
docker compose logs frontend --tail=10

# Port kontrolü
echo "🔌 Port kontrolü:"
netstat -tlnp | grep :80
netstat -tlnp | grep :443

# Site erişim testi
echo "🧪 Site erişim testi:"
curl -I http://localhost 2>/dev/null || echo "❌ HTTP erişim başarısız"
curl -I https://localhost 2>/dev/null || echo "❌ HTTPS erişim başarısız"

# Firewall kontrolü
echo "🛡️  Firewall durumu:"
ufw status

echo "✅ Kontroller tamamlandı!"
echo ""
echo "🌐 Eğer container'lar çalışıyorsa siteniz şu adreste olmalı:"
echo "https://pratik.volkankok.dev"
