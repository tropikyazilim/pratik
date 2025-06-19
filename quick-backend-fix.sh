#!/bin/bash

echo "=== QUICK BACKEND ENVIRONMENT FIX ==="
echo "Date: $(date)"

echo "1. Stopping and rebuilding backend..."
docker compose stop backend
docker compose rm -f backend
docker compose build --no-cache backend
docker compose up -d backend

echo "2. Waiting 15 seconds for startup..."
sleep 15

echo "3. Checking environment variables in backend..."
docker compose exec backend node -e "
console.log('=== ENV CHECK ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('=================');
"

echo "4. Testing database connection..."
docker compose exec backend node -e "
console.log('Testing DATABASE_URL parsing...');
const url = new URL(process.env.DATABASE_URL);
console.log('Parsed host:', url.hostname);
console.log('Parsed port:', url.port);
console.log('Parsed database:', url.pathname.slice(1));
"

echo "5. Backend logs (last 15 lines)..."
docker compose logs backend --tail=15

echo "=== FIX COMPLETE ==="
