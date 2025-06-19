#!/bin/bash

echo "=== SİTE AÇILMIYOR - ACİL TAMÎR ==="
echo "Date: $(date)"

echo "1. Mevcut container durumları..."
docker compose ps

echo ""
echo "2. Nginx durumu ve logları..."
docker compose logs nginx --tail=20

echo ""
echo "3. SSL sertifikası kontrol..."
ls -la nginx/ssl/ 2>/dev/null || echo "SSL klasörü bulunamadı"

echo ""
echo "4. Nginx config dosyası kontrol..."
docker compose exec nginx nginx -t 2>/dev/null || echo "Nginx config hatası"

echo ""
echo "5. Port'ların açık olup olmadığını kontrol..."
netstat -tlnp | grep -E "(80|443)"

echo ""
echo "6. Domain DNS çözümlemesi..."
nslookup pratik.volkankok.dev 2>/dev/null || echo "DNS çözümlenemedi"

echo ""
echo "7. Tüm servisleri yeniden başlatıyor..."
docker compose down
sleep 5
docker compose up -d

echo ""
echo "8. 20 saniye bekleniyor..."
sleep 20

echo ""
echo "9. Yeni durum kontrol..."
docker compose ps

echo ""
echo "10. Site erişim testi..."
curl -I http://pratik.volkankok.dev 2>/dev/null || echo "HTTP erişim başarısız"
curl -I https://pratik.volkankok.dev 2>/dev/null || echo "HTTPS erişim başarısız"

echo ""
echo "11. Nginx yeni logları..."
docker compose logs nginx --tail=10

echo ""
echo "=== TAMİR TAMAMLANDI ==="
echo ""
echo "Eğer hala çalışmıyorsa:"
echo "1. DNS ayarlarını kontrol edin"
echo "2. SSL sertifikasını yenileyin: certbot renew"
echo "3. Nginx config'i basit HTTP-only'ye çevirin"
