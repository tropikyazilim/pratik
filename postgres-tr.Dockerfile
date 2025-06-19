FROM postgres:17.2

# Türkçe locale kur
RUN apt-get update && \
    apt-get install -y locales && \
    echo "tr_TR.UTF-8 UTF-8" >> /etc/locale.gen && \
    locale-gen tr_TR.UTF-8 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Environment değişkenleri
ENV LANG=tr_TR.UTF-8
ENV LC_ALL=tr_TR.UTF-8
ENV LC_COLLATE=tr_TR.UTF-8
ENV LC_CTYPE=tr_TR.UTF-8
