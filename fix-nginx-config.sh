#!/bin/bash

echo "=== NGINX CONFIG HATASI DÜZELTİLDİ ==="
echo "Date: $(date)"

echo "1. Nginx config test ediliyor..."
docker compose exec nginx nginx -t

echo "2. SSL sertifikası kontrol ediliyor..."
ls -la /etc/letsencrypt/live/pratik.volkankok.dev/ 2>/dev/null || echo "SSL sertifikası bulunamadı"

echo "3. Nginx yeniden başlatılıyor..."
docker compose restart nginx

echo "4. 10 saniye bekleniyor..."
sleep 10

echo "5. Nginx durum kontrol..."
docker compose ps nginx

echo "6. Nginx logları..."
docker compose logs nginx --tail=10

echo "7. Port kontrol..."
netstat -tlnp | grep -E "(80|443)"

echo "8. Site erişim test..."
curl -I https://pratik.volkankok.dev 2>/dev/null || echo "HTTPS erişim başarısız"
curl -I http://pratik.volkankok.dev 2>/dev/null || echo "HTTP erişim başarısız"

echo ""
echo "=== Eğer SSL sertifikası yoksa çalıştırın: ==="
echo "sudo certbot --nginx -d pratik.volkankok.dev"
