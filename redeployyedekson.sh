#!/bin/bash

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

# Ana sistem nginx konfigürasyonu oluþtur
create_nginx_config() {
    echo "Ana sistem nginx konfigürasyonu oluþturuluyor..."
    
    NGINX_SITE_CONFIG="/etc/nginx/sites-available/${CUSTOMER_DOMAIN}"
    NGINX_SITE_ENABLED="/etc/nginx/sites-enabled/${CUSTOMER_DOMAIN}"
    
    # Eski konfigürasyonlarý temizle
    sudo rm -f /etc/nginx/sites-enabled/${CUSTOMER_NAME}
    sudo rm -f /etc/nginx/sites-enabled/${CUSTOMER_DOMAIN}
    sudo rm -f /etc/nginx/sites-available/${CUSTOMER_NAME}
    
    sudo tee $NGINX_SITE_CONFIG > /dev/null <<EOF
server {
    listen 80;
    server_name ${CUSTOMER_DOMAIN};
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl;
    server_name ${CUSTOMER_DOMAIN};

    # SSL sertifikalari
    ssl_certificate /etc/letsencrypt/live/${CUSTOMER_DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${CUSTOMER_DOMAIN}/privkey.pem;

    # SSL ayarlari
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Access ve error loglari
    access_log /var/log/nginx/${CUSTOMER_NAME}.access.log;
    error_log /var/log/nginx/${CUSTOMER_NAME}.error.log;

    # Container'a HTTP proxy
    location / {
        proxy_pass http://127.0.0.1:${NGINX_HTTP_PORT};
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Forwarded-Host \$server_name;
        proxy_redirect off;
        
        # Timeout ayarlari
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }
}
EOF

    # Site'yi aktifleþtir
    sudo ln -sf $NGINX_SITE_CONFIG $NGINX_SITE_ENABLED
    
    # Nginx konfigürasyonunu test et
    if sudo nginx -t; then
        echo "? Nginx konfigürasyonu baþarýlý!"
        sudo systemctl reload nginx
        echo "? Nginx reload edildi!"
        return 0
    else
        echo "? Nginx konfigürasyonu hatasý!"
        return 1
    fi
}

# Container nginx konfigürasyonu oluþtur
create_container_nginx_config() {
    echo "Container nginx konfigürasyonu oluþturuluyor..."
    
    # nginx/sites-available klasörünü oluþtur
    mkdir -p nginx/sites-available
    
    # Container nginx konfigürasyon dosyasýný oluþtur
    cat > nginx/sites-available/${CUSTOMER_NAME}.conf << EOF
# HTTP sunucusu (80 portu için)
server {
    listen 80;
    server_name _;

    # Backend API proxy
    location /api/ {
        proxy_pass http://${CUSTOMER_NAME}_backend:${API_PORT}/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_redirect off;
    }

    # Frontend (React App)
    location / {
        proxy_pass http://${CUSTOMER_NAME}_frontend:80;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_redirect off;
    }
}

# HTTPS sunucusu (443 portu için)
server {
    listen 443 ssl;
    server_name ${CUSTOMER_DOMAIN};

    # SSL sertifikalari
    ssl_certificate /etc/letsencrypt/live/${CUSTOMER_DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${CUSTOMER_DOMAIN}/privkey.pem;

    # SSL ayarlari
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    # Backend API proxy
    location /api/ {
        proxy_pass http://${CUSTOMER_NAME}_backend:${API_PORT}/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_redirect off;
    }

    # Frontend (React App)
    location / {
        proxy_pass http://${CUSTOMER_NAME}_frontend:80;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_redirect off;
    }

    # Guvenlik headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
EOF

    echo "? Container nginx konfigürasyonu oluþturuldu: nginx/sites-available/${CUSTOMER_NAME}.conf"
    
    # Aktif konfigürasyon dosyasýný da güncelle (docker-compose için)
    cp nginx/sites-available/${CUSTOMER_NAME}.conf ${CUSTOMER_NAME}.conf
    echo "? Aktif konfigürasyon güncellendi: ${CUSTOMER_NAME}.conf"
}

# Container nginx konfigürasyonu oluþtur
create_container_nginx_config

echo "Yeni build yapiliyor..."
docker compose build --no-cache

echo "containerlar baslatiliyor"
docker compose up -d --remove-orphans --force-recreate

echo "Container'lar hazýr olana kadar bekleniyor..."
sleep 10

echo "Network baðlantýsý test ediliyor..."
docker exec ${CUSTOMER_NAME}_nginx wget -O- http://backend:3000/health 2>/dev/null && echo "? Backend baðlantýsý OK" || echo "? Backend baðlantý hatasý"

# Ana sistem nginx konfigürasyonunu oluþtur
echo "Ana sistem nginx konfigürasyonu oluþturuluyor..."
if create_nginx_config; then
    echo "? Ana sistem nginx konfigürasyonu baþarýlý!"
else
    echo "?? Ana sistem nginx konfigürasyonu baþarýsýz! Manuel kontrol gerekli."
fi

echo "Deploy tamamlandi!"
docker compose ps

echo ""
echo "=== Site eriþim bilgileri ==="
echo "?? Ana Domain (Önerilen):"
echo "   HTTP:  http://${CUSTOMER_DOMAIN}"
echo "   HTTPS: https://${CUSTOMER_DOMAIN}"
echo ""
echo "?? Container Direkt Eriþim:"
echo "   HTTP:  http://$(curl -s -4 icanhazip.com):${NGINX_HTTP_PORT}"
echo "   HTTPS: https://$(curl -s -4 icanhazip.com):${NGINX_HTTPS_PORT}"
echo ""
echo "?? Test Komutlarý:"
echo "   curl -I https://${CUSTOMER_DOMAIN}"
echo "   curl -I http://127.0.0.1:${NGINX_HTTP_PORT}"
echo ""
echo "?? Log Takibi:"
echo "   sudo tail -f /var/log/nginx/${CUSTOMER_NAME}.error.log"
echo "   docker logs ${CUSTOMER_NAME}_nginx"
echo ""
echo "?? Konfigürasyon Dosyalarý:"
echo "   Container nginx: nginx/sites-available/${CUSTOMER_NAME}.conf"
echo "   Ana sistem nginx: /etc/nginx/sites-available/${CUSTOMER_DOMAIN}"