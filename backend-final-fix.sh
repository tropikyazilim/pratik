#!/bin/bash

# Backend Final Fix - .env dosyası düzeltildi

echo "🔧 Backend .env dosyası düzeltildi, yeniden build ediliyor..."

# Backend'i durdur
docker compose stop backend

# Backend'i rebuild et (güncellenmiş .env ile)
echo "🔨 Backend yeniden build ediliyor..."
docker compose build backend --no-cache

# Backend'i başlat
echo "🚀 Backend başlatılıyor..."
docker compose start backend

# Durum kontrol
sleep 15
echo "📊 Container durumları:"
docker compose ps

echo "📋 Backend logları:"
docker compose logs backend --tail=20

echo "🧪 Backend environment kontrol:"
docker compose exec backend cat /app/.env

echo "🌐 Database bağlantı test:"
docker compose exec backend node -e "
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.connect()
  .then(() => {
    console.log('✅ Database bağlantısı başarılı!');
    return client.query('SELECT NOW()');
  })
  .then(result => {
    console.log('⏰ Database zamanı:', result.rows[0].now);
    client.end();
  })
  .catch(err => {
    console.error('❌ Database bağlantı hatası:', err.message);
  });
"

echo "✅ Backend final fix tamamlandı!"
