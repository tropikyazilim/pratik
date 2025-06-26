// Veritabanı bağlantısı için gerekli kodlar v102
import pg from 'pg'; // PostgreSQL için
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// TypeScript tip tanımları
interface DbState {
  db: pg.Client | null;
  isConnected: boolean;
  currentUser: string | null;
  lastConnectionTime: Date | null;
}

// __dirname değişkenini ESM için tanımla
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env dosyasını ortama göre yükle
const envPath = path.join(__dirname, process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development');
dotenv.config({ path: envPath });
console.log(`[${new Date().toISOString()}] ${process.env.NODE_ENV || 'development'} ortamı için yapılandırma yüklendi: ${envPath}`);

// Database configuration helper function
function getDatabaseConfig() {
  // First try individual environment variables
  if (process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD && process.env.DB_NAME) {
    return {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    };
  }
  
  // Fallback to DATABASE_URL if available
  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    return {
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1), // Remove leading slash
      port: url.port ? parseInt(url.port) : 5432,
    };
  }
  
  // Default fallback (should not happen in production)
  throw new Error('No database configuration found. Set either DB_HOST, DB_USER, DB_PASSWORD, DB_NAME or DATABASE_URL');
}

// Veritabanı bağlantı durumu
let dbState: DbState = {
  db: null,
  isConnected: false,
  currentUser: null,
  lastConnectionTime: null
};

// Get database config
const dbConfig = getDatabaseConfig();
console.log(`[${new Date().toISOString()}] Database config loaded:`, {
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database,
  port: dbConfig.port
});

// Tüm PostgreSQL bağlantılarını temizlemek için pool
const pgPool = new pg.Pool(dbConfig);

/**
 * Kullanıcı adına göre veritabanı adını günceller ve tüm bağlantıları sıfırlar
 * @param {string} username - Kullanıcının adı
 */
export async function updateDbNameByUsername(username: string): Promise<pg.Client | null> {
  try {
    console.log(`[${new Date().toISOString()}] updateDbNameByUsername çağrıldı: ${username}`);
    console.log(`[DB STATE] Mevcut durum: connected=${dbState.isConnected}, user=${dbState.currentUser}`);
    
    // Tüm bağlantıları kapat ve bellekteki veritabanı referanslarını temizle
    await resetAllConnections();
    
    // .env dosyasının yolu (kesin yol kullanarak)
    const envPath = path.join(__dirname, '.env');
    console.log('.env dosya yolu:', envPath);
    
    try {
      // .env dosyasını oku
      let envContent = fs.readFileSync(envPath, 'utf8');
      
      // DB_NAME satırını bulup değerini kontrol et
      const currentDbNameMatch = envContent.match(/DB_NAME=(.*)/);
      const currentDbName = currentDbNameMatch ? currentDbNameMatch[1] : 'bilinmiyor';
      console.log(`Mevcut DB_NAME değeri: ${currentDbName}`);
      
      // DB_NAME satırını kullanıcı adıyla değiştir
      envContent = envContent.replace(/DB_NAME=.*/g, `DB_NAME=${username}`);
      
      // Değişiklikleri .env dosyasına yaz
      fs.writeFileSync(envPath, envContent);
      console.log(`.env dosyası güncellendi, yeni DB_NAME=${username}`);
      
      // Dotenv'i yeniden yükle
      dotenv.config({path: envPath, override: true});
      
      // process.env.DB_NAME değerini kontrol et
      console.log(`Yüklenen process.env.DB_NAME değeri: ${process.env.DB_NAME}`);
      
      if (process.env.DB_NAME !== username) {
        console.error(`HATA: process.env.DB_NAME (${process.env.DB_NAME}) !== istenen username (${username})`);
        // Zorla process.env'i güncelleyelim
        process.env.DB_NAME = username;
        console.log(`process.env.DB_NAME değeri zorla güncellendi: ${process.env.DB_NAME}`);
      }
    } catch (fsError) {
      console.error('.env dosyası işlenirken hata:', fsError);
      throw fsError;
    }
    
    // Veritabanı bağlantısını yeniden kur
    try {
      dbState.db = await createConnection();
      dbState.isConnected = true;
      dbState.currentUser = username;
      dbState.lastConnectionTime = new Date();
      
      console.log(`[${new Date().toISOString()}] Veritabanı bağlantısı başarıyla kuruldu: ${username} - ${process.env.DB_NAME}`);
    } catch (connError) {
      console.error('Veritabanı bağlantısı kurulurken hata:', connError);
      throw connError;
    }
    
    return dbState.db;
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Veritabanı adı güncellenirken ciddi hata:`, error);
    dbState.isConnected = false;
    throw error;
  }
}

/**
 * Tüm PostgreSQL bağlantılarını tamamen sıfırlar
 */
export async function resetAllConnections(): Promise<void> {
  try {
    console.log(`[${new Date().toISOString()}] TÜM BAĞLANTILAR SIFIRLANIYOR...`);
    
    // Mevcut db bağlantısını kapat
    if (dbState.db) {
      try {
        await dbState.db.end();
        console.log('Mevcut veritabanı bağlantısı kapatıldı');
      } catch (err) {
        console.error('Mevcut bağlantıyı kapatırken hata:', err);
      }
    }
    
    // Pool'daki tüm bağlantıları kapat
    try {
      await pgPool.end();
      console.log('PG Pool bağlantıları kapatıldı');
    } catch (err) {
      console.error('PG Pool bağlantılarını kapatırken hata:', err);
    }
    
    // Global değişkeni temizle
    dbState.db = null;
    dbState.isConnected = false;
    dbState.currentUser = null;
    
    // Garbage collection'ı zorlayalım (bu platform ve Node.js sürümüne bağlı olarak değişebilir)
    if (global.gc) {
      try {
        global.gc();
        console.log('Garbage collection zorlandı');
      } catch (err) {
        console.error('Garbage collection sırasında hata:', err);
      }
    }
    
    console.log('Tüm bağlantılar başarıyla kapatıldı ve bellek temizlendi');
  } catch (error) {
    console.error('Bağlantıları sıfırlarken hata:', error);
    throw error;
  }
}

/**
 * Yeni bir veritabanı bağlantısı oluşturur
 * @returns {Promise<pg.Client>} Veritabanı bağlantısı
 */
export async function createConnection(): Promise<pg.Client> {
  try {
    // Get database config (using the same helper function)
    const dbConfig = getDatabaseConfig();
    
    console.log(`[${new Date().toISOString()}] ${process.env.NODE_ENV || 'development'} ortamında veritabanına bağlanılıyor:`, {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database,
      port: dbConfig.port
    });

    // Veritabanı bağlantı nesnesi
    const client = new pg.Client(dbConfig);

    // Veritabanına bağlanma (await ile bekle)
    await client.connect();
    console.log(`PostgreSQL veritabanına (${dbConfig.database}) bağlandı`);
    
    // Test sorgusu yap, veritabanı ismine eriş
    try {
      const result = await client.query('SELECT current_database() as db_name');
      console.log('Bağlanılan gerçek veritabanı adı:', result.rows[0].db_name);
    } catch (testError) {
      console.error('Test sorgusu hatası:', testError);
    }
      // Hata dinleyicisi ekle
    client.on('error', async (err: Error) => {
      console.error('Veritabanı bağlantısında hata:', err);
      dbState.isConnected = false;
      // Yeniden bağlanma denemesi
      await reconnect();
    });
    
    return client;
  } catch (error) {
    console.error('Veritabanı bağlantısı kurulurken hata:', error);
    dbState.isConnected = false;
    throw error;
  }
}

/**
 * Mevcut bağlantıyı kapatır
 */
export async function closeConnection(): Promise<void> {
  if (dbState.db) {
    try {
      await dbState.db.end();
      console.log('Veritabanı bağlantısı kapatıldı');
      dbState.isConnected = false;
      dbState.currentUser = null;
    } catch (error) {
      console.error('Veritabanı bağlantısı kapatılırken hata:', error);
    }
  }
}

/**
 * Bağlantı koptuğunda yeniden bağlanmayı dener
 */
export async function reconnect(): Promise<void> {
  try {
    if (!dbState.isConnected && dbState.currentUser) {
      console.log(`Yeniden bağlanılıyor: ${dbState.currentUser}`);
      await updateDbNameByUsername(dbState.currentUser);
    }
  } catch (error) {
    console.error('Yeniden bağlanma hatası:', error);
  }
}

/**
 * Mevcut veritabanı bağlantısını döndürür veya yeni bir bağlantı oluşturur
 * @returns {Promise<pg.Client>} Veritabanı bağlantısı
 */
export async function getConnection(): Promise<pg.Client | null> {
  if (!dbState.isConnected) {
    await reconnect();
  }
  return dbState.db;
}

// İlk bağlantıyı kur
async function initializeConnection(): Promise<void> {
  try {
    dbState.db = await createConnection();
    dbState.isConnected = true;
  } catch (error) {
    console.error('İlk bağlantı hatası:', error);
  }
}

// Bağlantıyı başlat
initializeConnection();

/**
 * Geçici olarak istenen veritabanına bağlanır (örn: login için tropik)
 * @param {string} dbName - Bağlanılacak veritabanı adı
 * @returns {Promise<pg.Client>} Veritabanı bağlantısı
 */
export async function getCustomDbConnection(dbName: string): Promise<pg.Client> {
  const dbConfig = {
    ...getDatabaseConfig(),
    database: dbName,
  };
  const client = new pg.Client(dbConfig);
  await client.connect();
  return client;
}

export default dbState.db;