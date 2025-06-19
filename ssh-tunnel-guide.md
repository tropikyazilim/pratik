# SSH Tunnel ile PostgreSQL Erişimi Rehberi

## 1. SSH Tunnel Açma

### Windows PowerShell/CMD'de:
```bash
ssh -L 5432:localhost:5432 root@VPS_IP_ADRESINIZ
```

### Alternatif port (eğer localhost:5432 kullanılıyorsa):
```bash
ssh -L 5433:localhost:5432 root@VPS_IP_ADRESINIZ
```

## 2. Bağlantı Parametreleri Açıklaması:
- `-L 5432:localhost:5432` = Yerel port:Hedef host:Hedef port
- `5432` (sol) = Kendi bilgisayarınızdaki port
- `localhost:5432` (sağ) = VPS'te Docker container'daki PostgreSQL

## 3. pgAdmin Ayarları (SSH Tunnel Aktifken):
- Host: `localhost`
- Port: `5432` (veya tunnel'da belirlediğiniz port)
- Database: `pratik`
- Username: `postgres`
- Password: `devbros123`

## 4. Alternatif: PuTTY ile (Windows)
1. PuTTY'yi açın
2. Session > Host Name: VPS_IP_ADRESINIZ
3. Connection > SSH > Tunnels:
   - Source port: 5432
   - Destination: localhost:5432
   - Local seçin
   - Add'e tıklayın
4. Open ile bağlanın

## 5. SSH Key ile (Daha Güvenli):
```bash
ssh -i ~/.ssh/your_key -L 5432:localhost:5432 root@VPS_IP_ADRESINIZ
```

## 6. Background'da Çalıştırma:
```bash
ssh -f -N -L 5432:localhost:5432 root@VPS_IP_ADRESINIZ
```
- `-f` = Background'da çalışır
- `-N` = Komut çalıştırmaz, sadece tunnel

## 7. Tunnel'ı Kapatma:
- Terminal'i kapatın veya Ctrl+C
- Background için: `ps aux | grep ssh` ile PID bulun, `kill PID`

## 8. Test Etme:
```bash
# Kendi bilgisayarınızda:
psql -h localhost -p 5432 -U postgres -d pratik
```
