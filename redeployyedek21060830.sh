echo "Container lar durduruluyor..."
docker compose down

echo "Docker temizliði yapýlýyor..."
# Kullanýlmayan network'leri temizle
docker network prune -f

# Kullanýlmayan volume'leri temizle
docker volume prune -f

# Kullanýlmayan image'leri temizle
docker image prune -f

# Orphan container'larý temizle
docker container prune -f

# Müþteri bilgileri - HER MÜÞTERÝ ÝÇÝN DEÐÝÞTÝRÝLMESÝ GEREKEN ALANLAR
CUSTOMER_NAME="pratik"
CUSTOMER_DOMAIN="pratik.volkankok.dev"
POSTGRES_PASSWORD="devbros123"
DB_PORT="5433"
API_PORT="3000"
NGINX_HTTP_PORT="9080"
NGINX_HTTPS_PORT="9443"

echo "Müþteri ayarlarý güncelleniyor..."

if [ -z "$CUSTOMER_NAME" ] || [ -z "$CUSTOMER_DOMAIN" ] || [ -z "$POSTGRES_PASSWORD" ] || [ -z "$DB_PORT" ] || [ -z "$API_PORT" ] || [ -z "$NGINX_HTTP_PORT" ] || [ -z "$NGINX_HTTPS_PORT" ]; then
    echo "HATA: Lütfen tüm müþteri bilgilerini doldurun!"
    exit 1
fi

# .env dosyasýný güncelle
cat > .env << EOF
DB_HOST=database
DB_USER=postgres
DB_PASSWORD=${POSTGRES_PASSWORD}
DB_NAME=${CUSTOMER_NAME}
DB_PORT=${DB_PORT}
DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@database:5432/${CUSTOMER_NAME}
NODE_ENV=production
CORS_ORIGIN=https://${CUSTOMER_DOMAIN}
PORT=${API_PORT}
MUSTERI_ADI=${CUSTOMER_NAME}
MUSTERI_DOMAIN=${CUSTOMER_DOMAIN}
MUSTERI_POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
MUSTERI_DB_PORT=${DB_PORT}
MUSTERI_NGINX_HTTP_PORT=${NGINX_HTTP_PORT}
MUSTERI_NGINX_HTTPS_PORT=${NGINX_HTTPS_PORT}
EOF

# env.production dosyasýný güncelle
cat > env.production << EOF
VITE_API_URL=https://${CUSTOMER_DOMAIN}/api
VITE_APP_NAME=${CUSTOMER_NAME}
VITE_NODE_ENV=production
EOF

# env dosyasýný güncelle
cat > env << EOF
MUSTERI_ADI=${CUSTOMER_NAME}
MUSTERI_DOMAIN=${CUSTOMER_DOMAIN}
MUSTERI_POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
MUSTERI_DB_PORT=${DB_PORT}
MUSTERI_NGINX_HTTP_PORT=${NGINX_HTTP_PORT}
MUSTERI_NGINX_HTTPS_PORT=${NGINX_HTTPS_PORT}
EOF

echo "Müþteri ayarlarý güncellendi:"
echo "- Müþteri: $CUSTOMER_NAME"
echo "- Domain: $CUSTOMER_DOMAIN" 
echo "- DB Port: $DB_PORT"
echo "- API Port: $API_PORT"
echo "- Nginx HTTP: $NGINX_HTTP_PORT"
echo "- Nginx HTTPS: $NGINX_HTTPS_PORT"

echo "Yeni build yapiliyor..."
docker compose build --no-cache

echo "containerlar baslatiliyor"
docker compose up -d --remove-orphans --force-recreate

echo "Container'lar hazýr olana kadar bekleniyor..."
sleep 10

echo "Network baðlantýsý test ediliyor..."
docker exec ${CUSTOMER_NAME}_nginx wget -O- http://backend:3000/health 2>/dev/null && echo "? Backend baðlantýsý OK" || echo "? Backend baðlantý hatasý"

echo "Deploy tamamlandi!"
docker compose ps

echo "Site eriþim bilgileri:"
echo "HTTP: http://$(curl -s -4 icanhazip.com):${NGINX_HTTP_PORT}"
echo "HTTPS: https://$(curl -s -4 icanhazip.com):${NGINX_HTTPS_PORT}"