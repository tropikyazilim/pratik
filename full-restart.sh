#!/bin/bash

echo "=== TÜM SİSTEMİ YENIDEN BAŞLATMA ==="
echo "Date: $(date)"

echo "1. Tüm container'ları durduruyor..."
docker compose down

echo "2. Docker system temizliği yapılıyor..."
docker system prune -f

echo "3. Tüm servisler yeniden başlatılıyor..."
docker compose up -d

echo "4. Container'ların başlaması için 30 saniye bekleniyor..."
sleep 30

echo "5. Container durumları kontrol ediliyor..."
docker compose ps

echo "6. Servislerin loglarını kontrol ediliyor..."
echo "=== Database Logs ==="
docker compose logs database --tail=5

echo "=== Backend Logs ==="
docker compose logs backend --tail=5

echo "=== Frontend Logs ==="
docker compose logs frontend --tail=5

echo "=== Nginx Logs ==="
docker compose logs nginx --tail=5

echo ""
echo "7. Port'ları kontrol ediliyor..."
netstat -tlnp | grep -E "(80|443|5433)"

echo ""
echo "8. Site erişim testi..."
curl -I https://pratik.volkankok.dev 2>/dev/null | head -1 || echo "Site erişim başarısız"

echo ""
echo "=== RESTART TAMAMLANDI ==="
echo "Site: https://pratik.volkankok.dev"
echo "PostgreSQL: VPS_IP:5433"
echo "pgAdmin bağlantı bilgileri:"
echo "  Host: $(curl -s ifconfig.me 2>/dev/null || echo 'VPS_IP')"
echo "  Port: 5433"
echo "  Database: pratik"
echo "  Username: postgres"
echo "  Password: devbros123"
