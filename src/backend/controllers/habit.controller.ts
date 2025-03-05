import { Request, Response } from 'express';
import HabitModel from '../models/Habit.model';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import gamificationService from '../services/gamification.service';

/**
 * Создание новой привычки
 * @route POST /api/habits
 * @access Приватный
 */
export const createHabit = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { title, description, frequency, category, priority, targetEndDate } = req.body;
    
    // Проверяем аутентификацию
    if (!req.user || !req.user.id) {
      res.status(401).json({
        success: false,
        error: 'Не авторизован'
      });
      return;
    }
    
    // Проверка наличия обязательных полей
    if (!title) {
      res.status(400).json({
        success: false,
        error: 'Название привычки обязательно'
      });
      return;
    }
    
    if (!frequency) {
      res.status(400).json({
        success: false,
        error: 'Частота выполнения обязательна'
      });
      return;
    }
    
    if (!category) {
      res.status(400).json({
        success: false,
        error: 'Категория привычки обязательна'
      });
      return;
    }
    
    // Создание новой привычки
    const habit = await HabitModel.create({
      title,
      description,
      frequency,
      category,
      priority,
      targetEndDate,
      user: req.user.id
    });
    
    res.status(201).json({
      success: true,
      habit
    });
  } catch (error: any) {
    // Обработка ошибки дубликата (уникальный индекс по user + title)
    if (error.code === 11000 && error.keyPattern && (error.keyPattern.user && error.keyPattern.title)) {
      res.status(400).json({
        success: false,
        error: 'Привычка с таким названием уже существует'
      });
      return;
    }
    
    console.error('Ошибка создания привычки:', error);
    
    res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
};

/**
 * Получение списка привычек пользователя
 * @route GET /api/habits
 * @access Приватный
 */
export const getHabits = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Проверяем аутентификацию
    if (!req.user || !req.user.id) {
      res.status(401).json({
        success: false,
        error: 'Не авторизован'
      });
      return;
    }
    
    const habits = await HabitModel.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .exec();
    
    res.status(200).json({
      success: true,
      habits
    });
  } catch (error) {
    console.error('Ошибка при получении списка привычек:', error);
    
    res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
};

/**
 * Получение привычки по ID
 * @route GET /api/habits/:id
 * @access Приватный
 */
export const getHabitById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Проверяем аутентификацию
    if (!req.user || !req.user.id) {
      res.status(401).json({
        success: false,
        error: 'Не авторизован'
      });
      return;
    }
    
    const habit = await HabitModel.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!habit) {
      res.status(404).json({
        success: false,
        error: 'Привычка не найдена'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      habit
    });
  } catch (error) {
    console.error('Ошибка при получении привычки:', error);
    
    res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
};

/**
 * Обновление привычки
 * @route PUT /api/habits/:id
 * @access Приватный
 */
export const updateHabit = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Проверяем аутентификацию
    if (!req.user || !req.user.id) {
      res.status(401).json({
        success: false,
        error: 'Не авторизован'
      });
      return;
    }
    
    const { title, description, frequency, category, priority, targetEndDate } = req.body;
    
    // Проверка наличия обязательных полей
    if (!title) {
      res.status(400).json({
        success: false,
        error: 'Название привычки обязательно'
      });
      return;
    }
    
    const updatedFields = {
      title,
      description,
      frequency,
      category,
      priority,
      targetEndDate
    };
    
    // Обновление привычки
    const habit = await HabitModel.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: updatedFields },
      { new: true, runValidators: true }
    );
    
    if (!habit) {
      res.status(404).json({
        success: false,
        error: 'Привычка не найдена'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      habit
    });
  } catch (error: any) {
    // Обработка ошибки дубликата
    if (error.code === 11000 && error.keyPattern && (error.keyPattern.user && error.keyPattern.title)) {
      res.status(400).json({
        success: false,
        error: 'Привычка с таким названием уже существует'
      });
      return;
    }
    
    console.error('Ошибка обновления привычки:', error);
    
    res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
};

/**
 * Удаление привычки
 * @route DELETE /api/habits/:id
 * @access Приватный
 */
export const deleteHabit = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Проверяем аутентификацию
    if (!req.user || !req.user.id) {
      res.status(401).json({
        success: false,
        error: 'Не авторизован'
      });
      return;
    }
    
    const habit = await HabitModel.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!habit) {
      res.status(404).json({
        success: false,
        error: 'Привычка не найдена'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Привычка успешно удалена'
    });
  } catch (error) {
    console.error('Ошибка удаления привычки:', error);
    
    res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
};

/**
 * Отметка выполнения привычки
 * @route POST /api/habits/:id/complete
 * @access Приватный
 */
export const completeHabit = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Проверяем аутентификацию
    if (!req.user || !req.user.id) {
      res.status(401).json({
        success: false,
        error: 'Не авторизован'
      });
      return;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Находим привычку
    const habit = await HabitModel.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!habit) {
      res.status(404).json({
        success: false,
        error: 'Привычка не найдена'
      });
      return;
    }
    
    // Проверяем, не была ли привычка уже выполнена сегодня
    if (habit.completedToday) {
      res.status(400).json({
        success: false,
        error: 'Привычка уже отмечена как выполненная сегодня'
      });
      return;
    }
    
    // Создаем запись о выполнении
    const completionRecord = {
      date: today,
      completed: true
    };
    
    // Обновляем привычку
    const updatedHabit = await HabitModel.findByIdAndUpdate(
      habit._id,
      {
        $push: { completionHistory: completionRecord },
        $set: { completedToday: true },
        $inc: { streak: 1 }
      },
      { new: true }
    );
    
    // Начисление опыта пользователю
    const earnedExperience = gamificationService.calculateExperienceForCompletingHabit(
      habit.frequency,
      habit.priority,
      habit.streak + 1 // +1 потому что streak уже увеличен в updatedHabit
    );
    
    // Обновляем опыт пользователя
    const updatedUser = await gamificationService.updateUserExperience(
      req.user.id,
      earnedExperience
    );
    
    // Добавляем информацию о заработанном опыте в ответ
    res.status(200).json({
      success: true,
      habit: updatedHabit,
      experienceGained: earnedExperience,
      userLevel: updatedUser?.level || 0,
      userExperience: updatedUser?.experience || 0,
      levelUp: updatedUser && updatedUser.level && (habit.user as any).level ? updatedUser.level > (habit.user as any).level : false // Проверка повышения уровня
    });
  } catch (error) {
    console.error('Ошибка отметки выполнения привычки:', error);
    
    res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
}; 