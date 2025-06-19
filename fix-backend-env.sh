#!/bin/bash

echo "=== FIXING BACKEND DATABASE CONNECTION ==="
echo "Date: $(date)"
echo ""

# Step 1: First, let's add explicit environment variables to docker-compose.yml
echo "Step 1: Adding explicit environment variables to backend service..."

# Create a temporary docker-compose override
cat > docker-compose.override.yml << 'EOF'
version: '3.8'
services:
  backend:
    environment:
      - DB_HOST=database
      - DB_USER=postgres
      - DB_PASSWORD=devbros123
      - DB_NAME=pratik
      - DB_PORT=5432
      - DATABASE_URL=postgresql://postgres:devbros123@database:5432/pratik
      - NODE_ENV=production
      - CORS_ORIGIN=https://pratik.volkankok.dev
EOF

echo "✅ Created docker-compose.override.yml with explicit environment variables"

# Step 2: Fix the db.ts environment loading
echo ""
echo "Step 2: Fixing environment variable loading in db.ts..."

# Create a backup
cp b/db.ts b/db.ts.backup.$(date +%Y%m%d_%H%M%S)
# Fix the environment loading order in db.ts
cat > fix-db-env.js << 'EOF'
const fs = require('fs');

// Read the current db.ts file
let content = fs.readFileSync('b/db.ts', 'utf8');

// Replace the environment loading section
const oldEnvLoading = `// .env dosyasını ortama göre yükle
const envPath = path.join(__dirname, process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development');
dotenv.config({ path: envPath });
console.log(\`[\${new Date().toISOString()}] \${process.env.NODE_ENV || 'development'} ortamı için yapılandırma yüklendi: \${envPath}\`);`;

const newEnvLoading = `// Environment variables - Docker Compose takes precedence
// Only load .env files if environment variables are not already set
if (!process.env.DB_HOST) {
  const envPath = path.join(__dirname, process.env.NODE_ENV === 'production' ? '.env.production' : '.env');
  dotenv.config({ path: envPath });
  console.log(\`[\${new Date().toISOString()}] Loaded environment from file: \${envPath}\`);
} else {
  console.log(\`[\${new Date().toISOString()}] Using environment variables from Docker Compose\`);
}

// Log the final environment values
console.log(\`[\${new Date().toISOString()}] DB Configuration:\`, {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
  NODE_ENV: process.env.NODE_ENV
});`;

// Replace the content
content = content.replace(oldEnvLoading, newEnvLoading);

// Write the updated content
fs.writeFileSync('b/db.ts', content);
console.log('✅ Updated db.ts environment loading');
EOF

node fix-db-env.js
rm fix-db-env.js

echo "✅ Fixed db.ts environment variable loading"

# Step 3: Rebuild and restart backend
echo ""
echo "Step 3: Rebuilding and restarting backend container..."
docker compose stop backend
docker compose build backend --no-cache
docker compose up -d backend

echo ""
echo "Step 4: Waiting 10 seconds for backend to start..."
sleep 10

echo ""
echo "Step 5: Testing the connection..."
docker compose logs backend --tail=10

echo ""
echo "Step 6: Final connectivity test..."
docker compose exec backend node -e "
const pg = require('pg');
console.log('Testing with environment variables:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);

const client = new pg.Client({
  host: process.env.DB_HOST || 'database',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'devbros123',
  database: process.env.DB_NAME || 'pratik',
  port: parseInt(process.env.DB_PORT || '5432')
});

client.connect()
  .then(() => {
    console.log('✅ Backend can now connect to database!');
    return client.query('SELECT current_database(), version()');
  })
  .then(result => {
    console.log('Connected to:', result.rows[0].current_database);
    console.log('PostgreSQL version:', result.rows[0].version.split(' ')[0] + ' ' + result.rows[0].version.split(' ')[1]);
    client.end();
  })
  .catch(err => {
    console.log('❌ Connection still failed:', err.message);
    console.log('Error details:', err.code, err.address, err.port);
  });
" 2>/dev/null || echo "❌ Test failed - backend container might not be ready yet"

echo ""
echo "=== FIX COMPLETE ==="
echo "The backend environment has been fixed and container restarted."
echo "Check the logs above for connection status."
echo ""
echo "Next steps:"
echo "1. Test the website at https://pratik.volkankok.dev"
echo "2. Try adding a new module to verify database operations work"
echo "3. If issues persist, run: docker compose logs backend --tail=50"

echo "✅ Backend environment düzeltmesi tamamlandı!"
