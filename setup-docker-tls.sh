#!/bin/bash

# VPS'de TLS sertifikaları oluşturma scripti
# VPS'de çalıştırın

echo "🔐 Docker TLS sertifikaları oluşturuluyor..."

# Sertifika dizini oluştur
sudo mkdir -p /etc/docker/certs
cd /etc/docker/certs

# CA private key oluştur
sudo openssl genrsa -aes256 -out ca-key.pem 4096

# CA sertifikası oluştur
sudo openssl req -new -x509 -days 365 -key ca-key.pem -sha256 -out ca.pem

# Server private key oluştur
sudo openssl genrsa -out server-key.pem 4096

# Server CSR oluştur
sudo openssl req -subj "/CN=$HOSTNAME" -sha256 -new -key server-key.pem -out server.csr

# Server sertifikası oluştur
echo subjectAltName = DNS:$HOSTNAME,IP:10.10.10.20,IP:127.0.0.1 >> extfile.cnf
echo extendedKeyUsage = serverAuth >> extfile.cnf
sudo openssl x509 -req -days 365 -sha256 -in server.csr -CA ca.pem -CAkey ca-key.pem -out server-cert.pem -extfile extfile.cnf -CAcreateserial

# Client key oluştur
sudo openssl genrsa -out key.pem 4096
sudo openssl req -subj '/CN=client' -new -key key.pem -out client.csr

# Client sertifikası oluştur
echo extendedKeyUsage = clientAuth > extfile-client.cnf
sudo openssl x509 -req -days 365 -sha256 -in client.csr -CA ca.pem -CAkey ca-key.pem -out cert.pem -extfile extfile-client.cnf -CAcreateserial

# İzinleri ayarla
sudo chmod -v 0400 ca-key.pem key.pem server-key.pem
sudo chmod -v 0444 ca.pem server-cert.pem cert.pem

# Docker daemon konfigürasyonunu güncelle
sudo tee /etc/systemd/system/docker.service.d/override.conf > /dev/null <<EOF
[Service]
ExecStart=
ExecStart=/usr/bin/dockerd \\
    --tlsverify \\
    --tlscacert=/etc/docker/certs/ca.pem \\
    --tlscert=/etc/docker/certs/server-cert.pem \\
    --tlskey=/etc/docker/certs/server-key.pem \\
    -H fd:// \\
    -H tcp://0.0.0.0:2376 \\
    --containerd=/run/containerd/containerd.sock
EOF

# Docker'ı yeniden başlat
sudo systemctl daemon-reload
sudo systemctl restart docker

echo "✅ TLS konfigürasyonu tamamlandı!"
echo "📁 Client sertifikalarını indirin: ca.pem, cert.pem, key.pem"
