import express from 'express';
import { login, getProfile, logout } from '../controllers/userController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.get('/profile', authenticateJWT, getProfile);
router.post('/logout', logout);

export default router; 