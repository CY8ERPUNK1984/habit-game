import express from 'express';
import { getUserStats } from '../controllers/stats.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Маршрут для получения статистики пользователя
router.get('/', protect, getUserStats);

export default router; 