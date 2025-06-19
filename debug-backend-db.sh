#!/bin/bash

echo "=== BACKEND DATABASE CONNECTION DEBUG ==="
echo "Date: $(date)"
echo ""

echo "1. Container Status:"
docker compose ps
echo ""

echo "2. Backend Container Environment Variables:"
docker compose exec backend env | grep -E "(DB_|NODE_|DATABASE_)" | sort
echo ""

echo "3. Check if .env files exist in backend container:"
docker compose exec backend ls -la /app/.env*
echo ""

echo "4. Backend .env file content:"
docker compose exec backend cat /app/.env
echo ""

echo "5. Backend .env.production file content:"
docker compose exec backend cat /app/.env.production 2>/dev/null || echo "No .env.production file found"
echo ""

echo "6. Network connectivity test from backend to database:"
docker compose exec backend ping -c 3 database 2>/dev/null || echo "Ping failed"
echo ""

echo "7. Check if database port is accessible from backend:"
docker compose exec backend nc -zv database 5432 2>/dev/null || echo "Port 5432 not accessible"
echo ""

echo "8. Database container logs (last 10 lines):"
docker compose logs database --tail=10
echo ""

echo "9. Backend container logs (last 20 lines):"
docker compose logs backend --tail=20
echo ""

echo "10. Test database connection from backend container:"
docker compose exec backend node -e "
const pg = require('pg');
const client = new pg.Client({
  host: 'database',
  user: 'postgres', 
  password: 'devbros123',
  database: 'pratik',
  port: 5432
});
client.connect()
  .then(() => { console.log('✅ Direct connection successful'); client.end(); })
  .catch(err => console.log('❌ Direct connection failed:', err.message));
"
echo ""

echo "=== ENVIRONMENT VARIABLE DIAGNOSIS ==="
echo "11. Check Node.js process.env inside backend:"
docker compose exec backend node -e "
console.log('process.env.DB_HOST:', process.env.DB_HOST);
console.log('process.env.DB_USER:', process.env.DB_USER);
console.log('process.env.DB_NAME:', process.env.DB_NAME);
console.log('process.env.DB_PORT:', process.env.DB_PORT);
console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
console.log('process.env.DATABASE_URL:', process.env.DATABASE_URL);
"
echo ""

echo "=== POTENTIAL FIXES ==="
echo "If environment variables are not loaded correctly, we need to:"
echo "1. Ensure .env files are properly copied to container"
echo "2. Fix environment variable loading order in db.ts"
echo "3. Make sure Docker Compose environment variables are set correctly"
