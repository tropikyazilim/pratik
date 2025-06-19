#!/bin/bash

# Git repository URL'ini ayarla (kendi repository URL'inizi buraya yazın)
GIT_REPO_URL="https://github.com/tropikyazilim/pratik.git"

echo "🔧 Git remote kontrolü..."
if ! git remote get-url origin >/dev/null 2>&1; then
    echo "Git remote ekleniyor: $GIT_REPO_URL"
    git remote add origin $GIT_REPO_URL
else
    echo "Git remote mevcut: $(git remote get-url origin)"
fi

echo "🔄 Git güncellemeleri çekiliyor..."
git pull origin main

echo "📦 Container'lar durduruluyor..."
docker compose down

echo "🔨 Yeni build yapılıyor..."
docker compose build --no-cache

echo "🚀 Container'lar başlatılıyor..."
docker compose up -d

echo "✅ Deploy tamamlandı!"
docker compose ps
