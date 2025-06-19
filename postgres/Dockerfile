FROM postgres:17.2

# Türkçe locale'u yükle
RUN apt-get update && \
    apt-get install -y locales && \
    echo "tr_TR.UTF-8 UTF-8" >> /etc/locale.gen && \
    locale-gen tr_TR.UTF-8 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Locale environment'ını ayarla
ENV LANG=tr_TR.UTF-8
ENV LC_ALL=tr_TR.UTF-8
ENV LANGUAGE=tr_TR.UTF-8

# PostgreSQL'in Türkçe locale ile başlatılması için init argümanları
ENV POSTGRES_INITDB_ARGS="--encoding=UTF8 --lc-collate=tr_TR.UTF-8 --lc-ctype=tr_TR.UTF-8"
