import express from 'express';
import { register, login, getMe } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Регистрация нового пользователя
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Авторизация пользователя
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/me
// @desc    Получение данных текущего пользователя
// @access  Private
router.get('/me', protect, getMe);

export default router; 