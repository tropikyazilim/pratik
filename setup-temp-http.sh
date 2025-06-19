#!/bin/bash

echo "=== GEÇİCİ HTTP-ONLY CONFIG ==="
echo "Date: $(date)"

echo "1. Mevcut config backup alınıyor..."
cp nginx/sites-available/pratik.conf nginx/sites-available/pratik-ssl-backup.conf

echo "2. Geçici HTTP-only config aktifleştiriliyor..."
cp nginx/sites-available/pratik-temp.conf nginx/sites-available/pratik.conf

echo "3. Nginx config test ediliyor..."
docker compose exec nginx nginx -t 2>/dev/null || echo "Config henüz test edilemedi"

echo "4. Nginx restart..."
docker compose restart nginx

echo "5. 15 saniye bekleniyor..."
sleep 15

echo "6. Container durumları..."
docker compose ps

echo "7. Site HTTP erişim test..."
curl -I http://pratik.volkankok.dev 2>/dev/null || echo "HTTP erişim başarısız"

echo "8. Nginx logları..."
docker compose logs nginx --tail=10

echo ""
echo "=== GEÇİCİ HTTP ERİŞİM ==="
echo "Site: http://pratik.volkankok.dev"
echo ""
echo "=== SSL KURULUM İÇİN ==="
echo "1. certbot --nginx -d pratik.volkankok.dev"
echo "2. SSL kurulduktan sonra backup config'i geri yükle"
