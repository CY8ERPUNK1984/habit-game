import express from 'express';
import { 
  createHabit, 
  getHabits, 
  getHabitById, 
  updateHabit, 
  deleteHabit, 
  completeHabit 
} from '../controllers/habit.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

/**
 * @route   POST /api/habits
 * @desc    Создание новой привычки
 * @access  Приватный
 */
router.post('/', protect, createHabit);

/**
 * @route   GET /api/habits
 * @desc    Получение всех привычек пользователя
 * @access  Приватный
 */
router.get('/', protect, getHabits);

/**
 * @route   GET /api/habits/:id
 * @desc    Получение привычки по ID
 * @access  Приватный
 */
router.get('/:id', protect, getHabitById);

/**
 * @route   PUT /api/habits/:id
 * @desc    Обновление привычки
 * @access  Приватный
 */
router.put('/:id', protect, updateHabit);

/**
 * @route   DELETE /api/habits/:id
 * @desc    Удаление привычки
 * @access  Приватный
 */
router.delete('/:id', protect, deleteHabit);

/**
 * @route   POST /api/habits/:id/complete
 * @desc    Отметка выполнения привычки
 * @access  Приватный
 */
router.post('/:id/complete', protect, completeHabit);

export default router; 