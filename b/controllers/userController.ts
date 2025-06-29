// eslint-disable-next-line @typescript-eslint/no-explicit-any
// declare module 'bcrypt';

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getCustomDbConnection } from '../db.js';
import bcrypt from 'bcrypt';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_secret';

export async function register(req: Request, res: Response) {
  console.log("REGISTER FONKSİYONU ÇALIŞTI");
  const { email, username, password } = req.body;
  if (!email || !username || !password) {
    console.log("Eksik alanlar, 400 dönülüyor");
    return res.status(400).json({ message: 'Tüm alanlar zorunlu.' });
  }
  try {
    const db = await getCustomDbConnection('tropik');
    if (!db) {
      console.log("Veritabanı bağlantısı yok, 503 dönülüyor");
      return res.status(503).json({ message: 'Veritabanı bağlantısı yok.' });
    }
    // E-posta zaten var mı kontrol et
    const check = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (check.rows.length > 0) {
      await db.end();
      console.log("E-posta zaten var, 409 dönülüyor");
      return res.status(409).json({ message: 'Bu e-posta ile kayıtlı kullanıcı zaten var.' });
    }
    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);
    // Kaydı ekle
    const now = new Date();
    const result = await db.query(
      'INSERT INTO users (email, username, password, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, username',
      [email, username, hashedPassword, now, now]
    );
    await db.end();
    console.log("Kullanıcı başarıyla oluşturuldu, 201 dönülüyor");
    return res.status(201).json({ message: 'Kullanıcı başarıyla oluşturuldu.', user: result.rows[0] });
  } catch (err) {
    const error = err as Error;
    console.log("Sunucu hatası, 500 dönülüyor", error.message);
    return res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'E-mail ve şifre zorunlu.' });
  }
  try {
    // Sadece login için tropik veritabanına bağlan
    const db = await getCustomDbConnection('tropik');
    if (!db) {
      return res.status(503).json({ message: 'Veritabanı bağlantısı yok.' });
    }
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    console.log('Kullanıcı sorgu sonucu:', result.rows);
    if (result.rows.length === 0) {
      await db.end();
      return res.status(401).json({ message: 'Geçersiz e-mail veya şifre.' });
    }
    const user = result.rows[0];
    // Şifreyi bcrypt ile karşılaştır
    console.log('Şifre:', password);
    console.log('Hash:', user.password);
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Karşılaştırma sonucu:', isMatch);
    if (!isMatch) {
      await db.end();
      return res.status(401).json({ message: 'Geçersiz e-mail veya şifre.' });
    }
    await db.end();
    // Tokenlar
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
      { userId: user.id, email: user.email },
      REFRESH_TOKEN_SECRET,
      { expiresIn: '30d' }
    );
    // Refresh token'ı HTTP-only cookie olarak gönder
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 gün
    });
    // Access token'ı JSON ile gönder
    return res.json({ accessToken, username: user.username });
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
}

export async function getProfile(req: Request, res: Response) {
  // req.user middleware'den gelmeli
  const userReq = req as any;
  if (!userReq.user || !userReq.user.email) {
    return res.status(401).json({ message: 'Kullanıcı doğrulanamadı' });
  }
  try {
    const db = await getCustomDbConnection('tropik');
    if (!db) {
      return res.status(503).json({ message: 'Veritabanı bağlantısı yok.' });
    }
    const result = await db.query('SELECT id, email, username FROM users WHERE email = $1', [userReq.user.email]);
    await db.end();
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    const user = result.rows[0];
    return res.json(user);
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
}

export async function logout(req: Request, res: Response) {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.json({ message: 'Çıkış başarılı' });
}

export async function refresh(req: Request, res: Response) {
  const refreshToken = req.cookies?.refreshToken;
  
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token bulunamadı' });
  }

  try {
    // Refresh token'ı doğrula
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as any;
    
    // Kullanıcının hala var olduğunu kontrol et
    const db = await getCustomDbConnection('tropik');
    if (!db) {
      return res.status(503).json({ message: 'Veritabanı bağlantısı yok.' });
    }
    
    const result = await db.query('SELECT id, email FROM users WHERE id = $1', [decoded.userId]);
    await db.end();
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Kullanıcı bulunamadı' });
    }

    // Yeni access token oluştur
    const newAccessToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email },
      ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error('Refresh token hatası:', err);
    return res.status(401).json({ message: 'Geçersiz refresh token' });
  }
} 