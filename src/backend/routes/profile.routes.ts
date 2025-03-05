import express from 'express';
import { getProfile, updateProfile } from '../controllers/profile.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Маршрут для получения профиля текущего пользователя
router.get('/', protect, getProfile);

// Маршрут для обновления профиля пользователя
router.put('/', protect, updateProfile);

export default router; 