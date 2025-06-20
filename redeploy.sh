
echo "Container'lar durduruluyor..."
docker compose down

echo "Yeni build yapiliyorr..."
docker compose build --no-cache

echo "containerlar baslatiliyor"
docker compose up -d

echo "Deploy tamamlandi!"
docker compose ps