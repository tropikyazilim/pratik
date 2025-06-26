# Frontend Dockerfile  
FROM node:22-alpine as build-stage

# Çalışma dizinini ayarla
WORKDIR /app

# Package.json dosyalarını kopyala
COPY package*.json ./

# Dependencies yükle
RUN npm ci

# Kaynak kodunu kopyala
COPY . .

# Production build
RUN npm run build

# Production stage
FROM nginx:alpine

# Build edilen dosyaları nginx'e kopyala
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Nginx konfigürasyonu
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Port 80 expose et
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
