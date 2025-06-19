#!/bin/bash

# Backend Database Bağlantı Sorununu Çözme

echo "🔍 Backend database bağlantı sorunu analiz ediliyor..."

# Backend environment değişkenlerini kontrol et
echo "📋 Backend environment değişkenleri:"
docker compose exec backend printenv | grep -E "(DB_|DATABASE_)" || echo "Environment değişkenleri bulunamadı"

# Database container'ının IP adresini kontrol et
echo "🔌 Database container network bilgileri:"
docker compose exec backend ping -c 1 database || echo "Database hostname çözümlenemiyor"

# Backend loglarını detaylı kontrol et
echo "📋 Backend detaylı logları:"
docker compose logs backend --tail=20

# Database container durumu
echo "📊 Database container durumu:"
docker compose exec database psql -U postgres -d pratik -c "SELECT version();" || echo "Database bağlantı sorunu"

echo "🔧 Backend container'ını environment ile yeniden başlatacağım..."

# Backend container'ını durdur
docker compose stop backend

# Environment dosyasını container'a kopyala
docker cp b/.env.production pratik_backend:/app/.env

# Backend'i yeniden başlat
docker compose start backend

# Durum kontrol
sleep 15
echo "📊 Yeni durum:"
docker compose ps backend
docker compose logs backend --tail=10
