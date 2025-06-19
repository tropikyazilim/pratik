#!/bin/bash

# Complete Docker Compose File Fix

echo "🔧 Docker Compose dosyasını tamamen yeniden oluşturuyor..."

cat > docker-compose.yml << 'EOF'
services:
  # PostgreSQL Veritabanı
  database:
    image: postgres:17.2
    container_name: pratik_db
    environment:
      POSTGRES_DB: pratik
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: devbros123
    volumes:
      - postgres_data:/var/lib/postgresql/data
    expose:
      - "5432"
    restart: unless-stopped
    networks:
      - pratik_network

  # Backend API
  backend:
    build: 
      context: ./b
      dockerfile: Dockerfile
    container_name: pratik_backend
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://postgres:devbros123@database:5432/pratik
      PORT: 3000
    expose:
      - "3000"
    depends_on:
      - database
    restart: unless-stopped
    networks:
      - pratik_network

  # Frontend
  frontend:
    build:
      context: ./f
      dockerfile: Dockerfile
    container_name: pratik_frontend
    expose:
      - "80"
    depends_on:
      - backend
    restart: unless-stopped
    networks:
      - pratik_network

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: pratik_nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/sites-available:/etc/nginx/sites-available
      - ./nginx/ssl:/etc/nginx/ssl
      - certbot_data:/var/www/certbot
      - ssl_certs:/etc/letsencrypt
    depends_on:
      - frontend
      - backend
    restart: unless-stopped
    networks:
      - pratik_network

  # Let's Encrypt SSL Sertifikaları
  certbot:
    image: certbot/certbot
    container_name: pratik_certbot
    volumes:
      - certbot_data:/var/www/certbot
      - ssl_certs:/etc/letsencrypt
    command: certonly --webroot --webroot-path=/var/www/certbot --email volkankok@gmail.com --agree-tos --no-eff-email -d pratik.volkankok.dev
    networks:
      - pratik_network

volumes:
  postgres_data:
  certbot_data:
  ssl_certs:

networks:
  pratik_network:
    driver: bridge
EOF

echo "✅ Docker Compose dosyası yeniden oluşturuldu"

# Syntax kontrol
echo "🔍 Syntax kontrolü..."
if docker compose config > /dev/null 2>&1; then
    echo "✅ YAML syntax doğru"
else
    echo "❌ YAML syntax hatası:"
    docker compose config
    exit 1
fi

echo "🚀 Container'ları başlatıyor..."
docker compose down
docker compose up -d

echo "📊 Container durumları:"
docker compose ps

echo "🎉 Başarıyla tamamlandı!"
