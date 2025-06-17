-- Örnek veritabanı başlangıç scripti
-- Gerekli tabloları buraya ekleyebilirsiniz

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Diğer tablolarınızı buraya ekleyin
