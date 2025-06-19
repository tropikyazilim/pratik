# 🚀 Pratik.volkankok.dev Deployment Rehberi

## 📋 Gereksinimler

1. **Domain DNS Ayarları**
   - `pratik.volkankok.dev` A kaydı VPS IP'nize yönlendirilmiş olmalı
   - DNS değişikliklerinin yayılması için 24 saat bekleyin

2. **VPS Gereksinimleri**
   - Docker ve Docker Compose kurulu
   - Port 80 ve 443 açık
   - En az 2GB RAM

## 🛠️ Kurulum Adımları

### 1️⃣ Dosyaları VPS'e Yükle
```bash
# VPS'de proje dizini oluştur
mkdir -p /home/pratik-app
cd /home/pratik-app

# Projeyi yükle (SCP, SFTP veya Git ile)
# Örnek: scp -r ./pratik/* user@vps:/home/pratik-app/
```

### 2️⃣ DNS Kontrolü
```bash
# Domain'in VPS'e yönlendirildiğini kontrol et
nslookup pratik.volkankok.dev
ping pratik.volkankok.dev
```

### 3️⃣ İlk Deploy (HTTP)
```bash
# Dosyaları çalıştırılabilir yap
chmod +x *.sh

# SSL kurulumunu başlat
./setup-ssl.sh
```

### 4️⃣ Manuel SSL Kurulumu (Gerekirse)
```bash
# Önce HTTP modunda başlat
docker compose up -d database backend frontend nginx

# SSL sertifikası al
docker compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email volkan@volkankok.dev \
    --agree-tos \
    --no-eff-email \
    -d pratik.volkankok.dev

# HTTPS konfigürasyonunu aktifleştir
docker compose restart nginx
```

## 🔧 Yönetim Komutları

```bash
# Servisleri kontrol et
docker compose ps

# Logları izle
docker compose logs -f nginx
docker compose logs -f backend
docker compose logs -f frontend

# SSL sertifikasını yenile
docker compose run --rm certbot renew
docker compose restart nginx

# Servisleri yeniden başlat
docker compose restart

# Tamamen durdur
docker compose down

# Yeniden deploy
./deploy.sh
```

## 🌐 Erişim Adresleri

- **Frontend:** https://pratik.volkankok.dev
- **Backend API:** https://pratik.volkankok.dev/api
- **Veritabanı:** localhost:5432 (sadece VPS içinden)

## 🔒 Güvenlik Özellikleri

- ✅ SSL/TLS (Let's Encrypt)
- ✅ HTTPS zorunlu yönlendirme
- ✅ Security headers
- ✅ Rate limiting
- ✅ Gzip compression
- ✅ HSTS header

## 📊 Monitoring

```bash
# Container durumları
docker stats

# Disk kullanımı
docker system df

# Log dosyası boyutları
docker compose logs --tail=100 nginx
```

## 🚨 Sorun Giderme

### SSL Sertifikası Alınamıyor
```bash
# Domain DNS kontrolü
dig pratik.volkankok.dev

# Nginx konfigürasyonu test
docker compose exec nginx nginx -t

# Let's Encrypt logları
docker compose logs certbot
```

### 502 Bad Gateway
```bash
# Backend container çalışıyor mu?
docker compose ps backend

# Backend logları
docker compose logs backend

# Nginx upstream test
docker compose exec nginx ping pratik_backend
```

### Site Yavaş
```bash
# Resource kullanımı
docker stats

# Database bağlantı sayısı
docker compose exec database psql -U postgres -d pratik -c "SELECT count(*) FROM pg_stat_activity;"
```

## 🔄 SSL Otomatik Yenileme

Cron job otomatik oluşturulur:
```bash
# Mevcut cron jobları kontrol et
crontab -l

# Manuel yenileme
docker compose run --rm certbot renew && docker compose restart nginx
```
