#!/bin/bash

echo "Container lar durduruluyor..."
docker compose down

echo "Docker temizliði yapýlýyor..."
docker network prune -f
docker volume prune -f
docker image prune -f
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

# Container nginx konfigürasyonu oluþtur
create_container_nginx_config() {
    echo "Container nginx konfigürasyonu oluþturuluyor..."
    
    mkdir -p nginx/sites-available
    
    cat > nginx/sites-available/${CUSTOMER_NAME}.conf << EOF
server {
    listen 80;
    server_name _;

    location /api/ {
        proxy_pass http://${CUSTOMER_NAME}_backend:${API_PORT}/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_redirect off;
    }

    location / {
        proxy_pass http://${CUSTOMER_NAME}_frontend:80;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_redirect off;
    }
}
EOF

    echo "? Container nginx konfigürasyonu oluþturuldu"
    cp nginx/sites-available/${CUSTOMER_NAME}.conf ${CUSTOMER_NAME}.conf
}

create_container_nginx_config

echo "Yeni build yapiliyor..."
docker compose build --no-cache

echo "containerlar baslatiliyor"
docker compose up -d --remove-orphans --force-recreate

echo "Container'lar hazýr olana kadar bekleniyor..."
sleep 15

# Container adýný doðru al
DB_CONTAINER_NAME=$(docker compose ps --format "table {{.Name}}\t{{.Service}}" | grep database | awk '{print $1}')

if [ -z "$DB_CONTAINER_NAME" ]; then
    echo "? Database container bulunamadý!"
    echo "Mevcut container'lar:"
    docker compose ps
    exit 1
fi

echo "? Database container bulundu: $DB_CONTAINER_NAME"

# PostgreSQL container'ýnýn hazýr olup olmadýðýný kontrol et
echo "PostgreSQL baðlantýsý kontrol ediliyor..."
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    if docker exec $DB_CONTAINER_NAME pg_isready -U postgres -h localhost > /dev/null 2>&1; then
        echo "? PostgreSQL hazýr! (Attempt: $attempt)"
        break
    else
        echo "? PostgreSQL henüz hazýr deðil... (Attempt: $attempt/$max_attempts)"
        sleep 2
        attempt=$((attempt + 1))
    fi
done

if [ $attempt -gt $max_attempts ]; then
    echo "? PostgreSQL baðlantýsý kurulamadý!"
    echo "Container loglarý:"
    docker logs $DB_CONTAINER_NAME --tail=20
    exit 1
fi

# Veritabanýný oluþtur
echo "Veritabaný '${CUSTOMER_NAME}' oluþturuluyor..."
docker exec $DB_CONTAINER_NAME psql -U postgres -c "
CREATE DATABASE \"${CUSTOMER_NAME}\" 
WITH 
    ENCODING = 'UTF8' 
    LC_COLLATE = 'tr_TR.UTF-8' 
    LC_CTYPE = 'tr_TR.UTF-8'
    ICU_LOCALE = 'tr-TR'
    LOCALE_PROVIDER = 'icu'
    TEMPLATE = template0 
    CONNECTION LIMIT = -1;
" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "? Veritabaný '${CUSTOMER_NAME}' baþarýyla oluþturuldu!"
else
    echo "?? Veritabaný '${CUSTOMER_NAME}' zaten mevcut veya oluþturma hatasý"
fi

# moduller tablosunu oluþtur
echo "moduller tablosu oluþturuluyor..."
docker exec $DB_CONTAINER_NAME psql -U postgres -d "${CUSTOMER_NAME}" -c "
CREATE TABLE IF NOT EXISTS moduller (
    id SERIAL PRIMARY KEY,
    modul_adi VARCHAR(255) NOT NULL,
    modul_kodu VARCHAR(50),
    modul_aciklama TEXT
);

INSERT INTO moduller (modul_adi, modul_kodu, modul_aciklama) 
SELECT * FROM (VALUES 
    ('Kullanýcý Yönetimi', '1', 'Kullanýcý ekleme'),
    ('Rol Yönetimi', '2', 'Rol tanýmlama ve yetki atama iþlemleri'),
    ('Raporlama', '3', 'Sistem raporlarý ve analitik veriler'),
    ('Ayarlar', '4', 'Sistem genel ayarlarý'),
    ('Backup', '5', 'Veri yedekleme iþlemleri')
) AS v(modul_adi, modul_kodu, modul_aciklama)
WHERE NOT EXISTS (SELECT 1 FROM moduller);
"

if [ $? -eq 0 ]; then
    echo "? moduller tablosu baþarýyla oluþturuldu ve örnek veriler eklendi!"
else
    echo "? moduller tablosu oluþturma hatasý!"
fi

echo ""
echo "=== Veritabaný Bilgileri ==="
echo "?? Veritabaný Adý: ${CUSTOMER_NAME}"
echo "?? Container: $DB_CONTAINER_NAME"
echo ""

echo "=== moduller Tablosu Ýçeriði ==="
docker exec $DB_CONTAINER_NAME psql -U postgres -d "${CUSTOMER_NAME}" -c "SELECT * FROM moduller;" 2>/dev/null || echo "? Tablo içeriði gösterilemedi"
echo ""

# Container'lar arasý baðlantý testi
echo "Network baðlantýsý test ediliyor..."
BACKEND_CONTAINER=$(docker compose ps --format "table {{.Name}}\t{{.Service}}" | grep backend | awk '{print $1}')
if [ ! -z "$BACKEND_CONTAINER" ]; then
    docker exec $BACKEND_CONTAINER wget -q --spider http://database:5432 && echo "? Backend -> Database baðlantýsý OK" || echo "? Backend -> Database baðlantý hatasý"
fi

echo "Deploy tamamlandi!"
docker compose ps
docker restart ${CUSTOMER_NAME}_backend
echo ""
echo "=== Container Durumlarý ==="
docker compose ps
echo ""
echo "=== Veritabaný Test ==="
echo "?? Container'daki veritabanlarý:"
docker exec $DB_CONTAINER_NAME psql -U postgres -l

echo ""
echo "=== Site eriþim bilgileri ==="
echo "?? Ana Domain: https://${CUSTOMER_DOMAIN}"
echo "?? API Test: curl -I https://${CUSTOMER_DOMAIN}/api"
echo "?? Container Logs: docker logs $DB_CONTAINER_NAME"