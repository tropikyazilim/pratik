#!/bin/bash

# Nginx Temizlik ve Başlatma

echo "🧹 Nginx konfigürasyonlarını temizliyorum..."

# Backup dosyalarını kaldır
rm -f nginx/sites-available/*.backup
rm -f nginx/sites-available/*-ssl*
rm -f nginx/sites-available/*-temp*

# Sadece ana konfigürasyonu bırak
echo "📁 Sites-available içeriği:"
ls -la nginx/sites-available/

# Nginx konfigürasyonu test et
echo "🧪 Nginx test ediliyor..."
docker run --rm \
    -v $(pwd)/nginx/nginx.conf:/etc/nginx/nginx.conf \
    -v $(pwd)/nginx/sites-available:/etc/nginx/sites-available \
    nginx:alpine nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx konfigürasyonu temiz!"
    
    # Nginx'i başlat
    echo "🚀 Nginx başlatılıyor..."
    docker compose start nginx
    
    # Durum kontrol
    sleep 5
    docker compose ps
    
    # Port kontrol
    echo "🔌 Port kontrolü:"
    netstat -tlnp | grep :80
    
    # Site test
    echo "🌐 Site test:"
    curl -I http://localhost || echo "Localhost test başarısız"
    curl -I http://pratik.volkankok.dev || echo "External test başarısız"
    
else
    echo "❌ Hala konfigürasyon hatası var"
    echo "🔍 Sites-available dizini içeriği:"
    ls -la nginx/sites-available/
    cat nginx/sites-available/pratik.conf
fi
