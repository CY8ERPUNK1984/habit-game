import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import HabitModel from '../models/Habit.model';

/**
 * Получение статистики пользователя
 */
export const getUserStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    // Получаем все привычки пользователя
    const habits = await HabitModel.find({ user: userId });
    
    // Подсчитываем общее количество привычек
    const totalHabits = habits.length;
    
    // Подсчитываем общее количество выполнений
    let completedCount = 0;
    habits.forEach(habit => {
      completedCount += habit.completionHistory?.length || 0;
    });
    
    // Находим самую длинную серию
    let longestStreak = 0;
    habits.forEach(habit => {
      if (habit.streak > longestStreak) {
        longestStreak = habit.streak;
      }
    });

    return res.status(200).json({
      success: true,
      stats: {
        totalHabits,
        completedCount,
        longestStreak
      }
    });
  } catch (error) {
    console.error('Ошибка при получении статистики:', error);
    return res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
}; 