import { Request, Response } from 'express';
import UserModel from '../models/User.model';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

/**
 * Получение профиля текущего пользователя
 */
export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // req.user устанавливается middleware auth.protect
    const userId = req.user?.id;

    const user = await UserModel.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Пользователь не найден',
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        level: user.level,
        experience: user.experience,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Ошибка при получении профиля:', error);
    return res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера',
    });
  }
};

/**
 * Обновление профиля пользователя
 */
export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { name, avatar } = req.body;

    // Валидация входных данных
    if (name !== undefined && name.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Имя не может быть пустым',
      });
    }

    // Подготовка данных для обновления
    const updateData: { name?: string; avatar?: string } = {};
    
    if (name !== undefined) {
      updateData.name = name;
    }
    
    if (avatar !== undefined) {
      updateData.avatar = avatar;
    }

    // Если нет данных для обновления, возвращаем ошибку
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Не указаны данные для обновления',
      });
    }

    // Обновляем пользователя
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: 'Пользователь не найден',
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        level: updatedUser.level,
        experience: updatedUser.experience,
        avatar: updatedUser.avatar,
      },
    });
  } catch (error) {
    console.error('Ошибка при обновлении профиля:', error);
    return res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера',
    });
  }
}; 