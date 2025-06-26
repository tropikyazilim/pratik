#!/bin/bash

echo "Container lar durduruluyor..."
docker compose down

echo "Docker temizli ki yapil l yor..."
docker network prune -f
docker volume prune -f
docker image prune -f
docker container prune -f

# M  teri bilgileri - HER M  TER     N DE   T R LMES  GEREKEN ALANLAR
CUSTOMER_NAME="pratik"
CUSTOMER_DOMAIN="pratik.volkankok.dev"
POSTGRES_PASSWORD="devbros123"
DB_PORT="5400"
API_PORT="3000"
NGINX_HTTP_PORT="9000"
NGINX_HTTPS_PORT="9400"

echo "M  teri ayarlar  g ncelleniyor..."

if [ -z "$CUSTOMER_NAME" ] || [ -z "$CUSTOMER_DOMAIN" ] || [ -z "$POSTGRES_PASSWORD" ] || [ -z "$DB_PORT" ] || [ -z "$API_PORT" ] || [ -z "$NGINX_HTTP_PORT" ] || [ -z "$NGINX_HTTPS_PORT" ]; then
    echo "HATA: L tfen t m m  teri bilgilerini doldurun!"
    exit 1
fi

# .env dosyas n  g ncelle
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

# env.production dosyas n  g ncelle
cat > env.production << EOF
VITE_API_URL=https://${CUSTOMER_DOMAIN}
VITE_APP_NAME=${CUSTOMER_NAME}
VITE_NODE_ENV=production
EOF

# env dosyas n  g ncelle
cat > env << EOF
MUSTERI_ADI=${CUSTOMER_NAME}
MUSTERI_DOMAIN=${CUSTOMER_DOMAIN}
MUSTERI_POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
MUSTERI_DB_PORT=${DB_PORT}
MUSTERI_NGINX_HTTP_PORT=${NGINX_HTTP_PORT}
MUSTERI_NGINX_HTTPS_PORT=${NGINX_HTTPS_PORT}
EOF

# backend env ayarla
cat > b/.env << EOF
PORT=${API_PORT}
DB_HOST=database
DB_USER=postgres
DB_PASSWORD=${POSTGRES_PASSWORD}
DB_NAME=${CUSTOMER_NAME}
DB_PORT=5432
DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@database:5432/${CUSTOMER_NAME}
NODE_ENV=production
CORS_ORIGIN=https://${CUSTOMER_DOMAIN}
EOF

# backend env production ayarla
cat > b/.env.production << EOF
# Production Veritabanı Bağlantı Bilgileri (Docker İçin)
DB_HOST=database
DB_USER=postgres
DB_PASSWORD=${POSTGRES_PASSWORD}
DB_NAME=${CUSTOMER_NAME}
DB_PORT=5432
DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@database:5432/${CUSTOMER_NAME}

# Production Sunucu Ayarları
PORT=${API_PORT}
NODE_ENV=production

# Güvenlik Ayarları
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
CORS_ORIGIN=https://${CUSTOMER_DOMAIN}

# Logging
LOG_LEVEL=error
EOF

# frontend env ayarla
cat > f/.env.production << EOF
# Production Environment
VITE_API_URL=https://${CUSTOMER_DOMAIN}
VITE_APP_NAME=${CUSTOMER_NAME}
VITE_NODE_ENV=production
EOF


echo "M  teri ayarlar  g ncellendi:"
echo "- M  teri: $CUSTOMER_NAME"
echo "- Domain: $CUSTOMER_DOMAIN" 
echo "- DB Port: $DB_PORT"
echo "- API Port: $API_PORT"
echo "- Nginx HTTP: $NGINX_HTTP_PORT"
echo "- Nginx HTTPS: $NGINX_HTTPS_PORT"

# Container nginx konfig rasyonu olu tur
create_container_nginx_config() {
    echo "Container nginx konfig rasyonu olu turuluyor..."
    
    # Nginx klasörleri oluştur
    mkdir -p nginx/sites-available
    
    # Ana nginx.conf dosyasının varlığını kontrol et, yoksa oluştur
    if [ ! -f "nginx/nginx.conf" ]; then
        echo "nginx.conf oluşturuluyor..."
        cat > nginx/nginx.conf << 'EOF'
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log notice;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    # Performance
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/x-javascript
        application/xml+rss
        application/javascript
        application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

    # Include site configs
    include /etc/nginx/sites-available/*;
}
EOF
    fi
    
    # Müşteri spesifik site konfigürasyonu oluştur
    cat > nginx/sites-available/${CUSTOMER_NAME}.conf << EOF
server {
    listen 80;
    server_name _;

    location /api/ {
        proxy_pass http://${CUSTOMER_NAME}_backend:${API_PORT};
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

    echo "? Container nginx konfig rasyonu olu turuldu"
    echo "? Ana nginx.conf kontrol edildi"
    echo "? M  teri konfig dosyas  olu turuldu: nginx/sites-available/${CUSTOMER_NAME}.conf"
}

# Ana sistem nginx konfig rasyonu olu tur
create_system_nginx_config() {
    echo "Ana sistem nginx konfig rasyonu olu turuluyor..."
    
    # Sistem nginx sites-available klas r n  kontrol et
    if [ ! -d "/etc/nginx/sites-available" ]; then
        echo "UYARI: /etc/nginx/sites-available klas r  bulunamad !"
        echo "Nginx kurulu de il olabilir. Devam ediliyor..."
        return 1
    fi
    
    # Ana sistem nginx konfig dosyas n  olu tur
    sudo tee /etc/nginx/sites-available/${CUSTOMER_DOMAIN} > /dev/null << EOF
server {
    listen 80;
    server_name ${CUSTOMER_DOMAIN};
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl;
    server_name ${CUSTOMER_DOMAIN};

    # SSL sertifikalar 
    ssl_certificate /etc/letsencrypt/live/${CUSTOMER_DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${CUSTOMER_DOMAIN}/privkey.pem;

    # SSL ayarlar 
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Access ve error loglar 
    access_log /var/log/nginx/${CUSTOMER_DOMAIN}.access.log;
    error_log /var/log/nginx/${CUSTOMER_DOMAIN}.error.log;

    # Container'a HTTP proxy
    location / {
        proxy_pass http://127.0.0.1:${NGINX_HTTP_PORT};
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Forwarded-Host \$server_name;
        proxy_redirect off;

        # Timeout ayarlar 
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }
}
EOF

    if [ $? -eq 0 ]; then
        echo "? Ana sistem nginx konfig dosyas  olu turuldu: /etc/nginx/sites-available/${CUSTOMER_DOMAIN}"
        
        # Konfig dosyas n  aktif et (sites-enabled'a symlink olu tur)
        if [ -d "/etc/nginx/sites-enabled" ]; then
            sudo ln -sf /etc/nginx/sites-available/${CUSTOMER_DOMAIN} /etc/nginx/sites-enabled/
            echo "? Konfig dosyas  aktif edildi: /etc/nginx/sites-enabled/${CUSTOMER_DOMAIN}"
        else
            echo "UYARI: /etc/nginx/sites-enabled klas r  bulunamad !"
        fi
        
        # Nginx konfig rasyonunu test et
        echo "Nginx konfig rasyonu test ediliyor..."
        if sudo nginx -t > /dev/null 2>&1; then
            echo "? Nginx konfig rasyonu ge erli!"
            
            # Nginx'i yeniden ba lat
            echo "Ana sistem nginx yeniden ba lat l yor..."
            if sudo systemctl reload nginx > /dev/null 2>&1; then
                echo "? Ana sistem nginx ba ar yla yeniden y klendi!"
            else
                echo "? Ana sistem nginx yeniden y klenemiyor, restart deneniyor..."
                sudo systemctl restart nginx
                if [ $? -eq 0 ]; then
                    echo "? Ana sistem nginx ba ar yla restart edildi!"
                else
                    echo "? Ana sistem nginx restart edilemedi!"
                fi
            fi
        else
            echo "? Nginx konfig rasyonunda hata var!"
            echo "Hata detaylar :"
            sudo nginx -t
            return 1
        fi
    else
        echo "? Ana sistem nginx konfig dosyas  olu turulamad !"
        return 1
    fi
}

# SSL sertifikası kontrol et ve gerekiyorsa al
setup_ssl_certificate() {
    echo "SSL sertifikası kontrol ediliyor..."
    
    # Certbot kurulu mu kontrol et
    if ! command -v certbot &> /dev/null; then
        echo "Certbot kurulu değil, kuruluyor..."
        sudo apt update
        sudo apt install -y certbot python3-certbot-nginx
    fi
    
    # SSL sertifikası var mı kontrol et
    if [ -f "/etc/letsencrypt/live/${CUSTOMER_DOMAIN}/fullchain.pem" ] && [ -f "/etc/letsencrypt/live/${CUSTOMER_DOMAIN}/privkey.pem" ]; then
        echo "✅ SSL sertifikası mevcut: ${CUSTOMER_DOMAIN}"
        
        # Sertifika geçerlilik süresi kontrol et
        EXPIRE_DATE=$(sudo openssl x509 -enddate -noout -in /etc/letsencrypt/live/${CUSTOMER_DOMAIN}/fullchain.pem | cut -d= -f 2)
        EXPIRE_TIMESTAMP=$(date -d "$EXPIRE_DATE" +%s)
        CURRENT_TIMESTAMP=$(date +%s)
        DAYS_LEFT=$(( (EXPIRE_TIMESTAMP - CURRENT_TIMESTAMP) / 86400 ))
        
        echo "📅 Sertifika süresi: $DAYS_LEFT gün kaldı"
        
        if [ $DAYS_LEFT -lt 30 ]; then
            echo "⚠️ Sertifika 30 günden az süre kaldı, yenileniyor..."
            sudo certbot renew --nginx --quiet
            if [ $? -eq 0 ]; then
                echo "✅ SSL sertifikası başarıyla yenilendi!"
            else
                echo "❌ SSL sertifikası yenilenemedi!"
                return 1
            fi
        fi
    else
        echo "🔒 SSL sertifikası bulunamadı, yeni sertifika alınıyor..."
        
        # DNS kontrolü yap
        echo "📡 DNS kontrolü yapılıyor..."
        if ! nslookup ${CUSTOMER_DOMAIN} > /dev/null 2>&1; then
            echo "❌ DNS hatası: ${CUSTOMER_DOMAIN} çözümlenemiyor!"
            echo "⚠️  DNS A kaydının doğru olduğundan emin olun"
            sudo systemctl start nginx
            exit 1
        fi
        
        # Port 80 kontrolü
        echo "🔌 Port 80 kontrolü yapılıyor..."
        if sudo netstat -tlnp | grep :80 > /dev/null 2>&1; then
            echo "⚠️  Port 80 kullanımda, nginx durduruluyor..."
        fi
        
        # Nginx'i geçici olarak durdur (port 80 boş olmalı)
        sudo systemctl stop nginx
        
        # Standalone modda sertifika al
        sudo certbot certonly --standalone \
            --non-interactive \
            --agree-tos \
            --email volkankok@gmail.com \
            --domains ${CUSTOMER_DOMAIN} \
            --keep-until-expiring
        
        if [ $? -eq 0 ]; then
            echo "✅ SSL sertifikası başarıyla alındı: ${CUSTOMER_DOMAIN}"
            
            # Nginx'i tekrar başlat
            sudo systemctl start nginx
            
            # Sertifika dosyalarının varlığını tekrar kontrol et
            if [ -f "/etc/letsencrypt/live/${CUSTOMER_DOMAIN}/fullchain.pem" ] && [ -f "/etc/letsencrypt/live/${CUSTOMER_DOMAIN}/privkey.pem" ]; then
                echo "✅ Sertifika dosyaları doğrulandı"
            else
                echo "❌ Sertifika dosyaları bulunamadı!"
                return 1
            fi
        else
            echo "❌ SSL sertifikası alınamadı!"
            echo ""
            echo "🚨 KRİTİK HATA: SSL SERTİFİKASI ALINAMADI! 🚨"
            echo "==============================================="
            echo "⚠️  Domain: ${CUSTOMER_DOMAIN}"
            echo "⚠️  .dev uzantılı domainler HTTPS zorunludur!"
            echo "⚠️  HTTP modda çalışamaz (Chrome HSTS)"
            echo ""
            echo "🔧 Olası Çözümler:"
            echo "   1. DNS ayarlarını kontrol edin (A kaydı doğru mu?)"
            echo "   2. Domain'in sizin kontrolünüzde olduğunu doğrulayın"
            echo "   3. Firewall port 80'i açık mı kontrol edin"
            echo "   4. Manuel sertifika alımı deneyin:"
            echo "      sudo certbot certonly --manual -d ${CUSTOMER_DOMAIN}"
            echo ""
            echo "❌ Deploy işlemi durduruluyor..."
            echo "==============================================="
            
            # Nginx'i başlat ama SSL olmadan çalışmayacağını belirt
            sudo systemctl start nginx
            exit 1
        fi
    fi
    
    # Auto-renewal cron job'unu kontrol et ve ekle
    if ! sudo crontab -l 2>/dev/null | grep -q "certbot renew"; then
        echo "📅 SSL otomatik yenileme cron job'u ekleniyor..."
        (sudo crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | sudo crontab -
        echo "✅ SSL otomatik yenileme ayarlandı (günde 12:00'da)"
    fi
}

# Her iki nginx konfigürasyonunu da oluştur
create_container_nginx_config
create_system_nginx_config
setup_ssl_certificate

echo "Yeni build yapiliyor..."
docker compose build --no-cache

echo "containerlar baslatiliyor"
docker compose up -d --remove-orphans --force-recreate

echo "Container'lar haz r olana kadar bekleniyor..."
sleep 15

# Container ad n  do ru al
DB_CONTAINER_NAME=$(docker compose ps --format "table {{.Name}}\t{{.Service}}" | grep database | awk '{print $1}')

if [ -z "$DB_CONTAINER_NAME" ]; then
    echo "? Database container bulunamad !"
    echo "Mevcut container'lar:"
    docker compose ps
    exit 1
fi

echo "? Database container bulundu: $DB_CONTAINER_NAME"

# PostgreSQL container' n n haz r olup olmad   n  kontrol et
echo "PostgreSQL ba lant s  kontrol ediliyor..."
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    if docker exec $DB_CONTAINER_NAME pg_isready -U postgres -h localhost > /dev/null 2>&1; then
        echo "? PostgreSQL haz r! (Attempt: $attempt)"
        break
    else
        echo "? PostgreSQL hen z haz r de il... (Attempt: $attempt/$max_attempts)"
        sleep 2
        attempt=$((attempt + 1))
    fi
done

if [ $attempt -gt $max_attempts ]; then
    echo "? PostgreSQL ba lant s  kurulamad !"
    echo "Container loglar :"
    docker logs $DB_CONTAINER_NAME --tail=20
    exit 1
fi

# Veritaban n  olu tur
echo "Veritaban  '${CUSTOMER_NAME}' olu turuluyor..."
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
    echo "? Veritaban  '${CUSTOMER_NAME}' ba ar yla olu turuldu!"
else
    echo "?? Veritaban  '${CUSTOMER_NAME}' zaten mevcut veya olu turma hatas "
fi

# PostgreSQL backup restore işlemi
echo "Veritabanı yedeği postgres/pratik.backup dosyasından geri yükleniyor..."
BACKUP_PATH="postgres/pratik.backup"
docker cp "$BACKUP_PATH" $DB_CONTAINER_NAME:/pratik.backup
docker exec $DB_CONTAINER_NAME pg_restore -U postgres -d "${CUSTOMER_NAME}" /pratik.backup
if [ $? -eq 0 ]; then
    echo "? Backup başarıyla restore edildi!"
else
    echo "? Backup restore işlemi başarısız oldu!"
fi

# Tropik veritabanı olustur
echo "Veritabani  'tropik' olusturuluyor..."
docker exec $DB_CONTAINER_NAME psql -U postgres -c "
CREATE DATABASE \"tropik\" 
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
    echo "? Veritaban  'tropik' ba ar yla olu turuldu!"
else
    echo "?? Veritaban  'tropik' zaten mevcut veya olu turma hatas "
fi

# PostgreSQL backup restore işlemi
echo "Veritabanı yedeği postgres/tropik.backup dosyasından geri yükleniyor..."
BACKUP_PATH="postgres/tropik.backup"
docker cp "$BACKUP_PATH" $DB_CONTAINER_NAME:/tropik.backup
docker exec $DB_CONTAINER_NAME pg_restore -U postgres -d "tropik" /tropik.backup
if [ $? -eq 0 ]; then
    echo "? Backup başarıyla restore edildi!"
else
    echo "? Backup restore işlemi başarısız oldu!"
fi

echo ""
echo "=== Veritaban  Bilgileri ==="
echo "?? Veritaban  Ad : ${CUSTOMER_NAME}"
echo "?? Container: $DB_CONTAINER_NAME"
echo ""

echo "=== moduller Tablosu   eri i ==="
docker exec $DB_CONTAINER_NAME psql -U postgres -d "${CUSTOMER_NAME}" -c "SELECT * FROM moduller;" 2>/dev/null || echo "? Tablo i eri i g sterilemedi"
echo ""

# Container'lar aras  ba lant  testi
echo "Network ba lant s  test ediliyor..."
BACKEND_CONTAINER=$(docker compose ps --format "table {{.Name}}\t{{.Service}}" | grep backend | awk '{print $1}')
if [ ! -z "$BACKEND_CONTAINER" ]; then
    docker exec $BACKEND_CONTAINER wget -q --spider http://database:5432 && echo "? Backend -> Database ba lant s  OK" || echo "? Backend -> Database ba lant  hatas "
fi

echo "Deploy tamamlandi!"
docker compose ps
docker restart ${CUSTOMER_NAME}_backend
echo ""
echo "=== Container Durumlar  ==="
docker compose ps
echo ""
echo "=== Veritaban  Test ==="
echo "?? Container'daki veritabanlar :"
docker exec $DB_CONTAINER_NAME psql -U postgres -l

echo ""
echo "=== Site eri im bilgileri ==="
echo "?? Ana Domain: https://${CUSTOMER_DOMAIN}"
echo "?? API Test: curl -I https://${CUSTOMER_DOMAIN}/api"
echo "?? Container Logs: docker logs $DB_CONTAINER_NAME"