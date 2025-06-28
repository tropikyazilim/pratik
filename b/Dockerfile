# Backend Dockerfile
FROM node:22-alpine

# Çalışma dizinini ayarla
WORKDIR /app

# Package.json dosyalarını kopyala
COPY package*.json ./

# Dependencies yükle
RUN npm ci --only=production && npm cache clean --force

# TypeScript ve build dependencies için
COPY package.json ./
RUN npm install typescript ts-node @types/node --save-dev

# Kaynak kodunu kopyala
COPY . .

# Environment dosyasını kopyala
COPY .env.production .env

# TypeScript build
RUN npm run build

# Development dependencies'leri kaldır
RUN npm prune --production

# Port expose et
EXPOSE 3000

# Production modunda başlat
CMD ["npm", "run", "start:prod"]