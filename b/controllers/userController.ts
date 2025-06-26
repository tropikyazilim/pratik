import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getCustomDbConnection } from '../db.js';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_secret';

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
    if (result.rows.length === 0) {
      await db.end();
      return res.status(401).json({ message: 'Geçersiz e-mail veya şifre.' });
    }
    const user = result.rows[0];
    if (user.password !== password) {
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
    return res.json({ accessToken });
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
} 