#!/bin/bash

# Final Nginx Düzeltme

echo "🔧 Final nginx düzeltmesi..."

# Gereksiz dosyaları temizle
rm -f nginx/sites-available/pratik-http-only.conf
rm -f nginx/sites-available/pratik-temp.conf
rm -f nginx/sites-available/*backup*
rm -f nginx/sites-available/*ssl*

# Sadece pratik.conf bırak
echo "📁 Temizlik sonrası dosyalar:"
ls nginx/sites-available/

# Ana konfigürasyonu kontrol et
echo "📝 Ana konfigürasyon:"
cat nginx/sites-available/pratik.conf

# Nginx test et
echo "🧪 Nginx test:"
docker run --rm \
    -v $(pwd)/nginx/nginx.conf:/etc/nginx/nginx.conf \
    -v $(pwd)/nginx/sites-available:/etc/nginx/sites-available \
    nginx:alpine nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx konfigürasyonu geçerli!"
    
    # Nginx'i başlat
    docker compose start nginx
    
    # Durum kontrol
    sleep 10
    echo "📊 Container durumları:"
    docker compose ps
    
    # Site test
    echo "🌐 Site test:"
    curl -I http://pratik.volkankok.dev
    
else
    echo "❌ Konfigürasyon hatalı, container network'ü içinde test edelim"
    
    # Container network'ü içinde test et
    echo "🔄 Container network test..."
    docker compose exec nginx nginx -t
fi
