import express from 'express';
import { login, getProfile, logout, register, refresh } from '../controllers/userController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/refresh', refresh);
router.get('/profile', authenticateJWT, getProfile);
router.post('/logout', logout);
router.post('/register', register);

export default router; 