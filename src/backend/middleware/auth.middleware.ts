import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel, { IUser } from '../models/User.model';
import mongoose from 'mongoose';

// Интерфейс для запроса с аутентифицированным пользователем
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

/**
 * Middleware для защиты маршрутов, требующих аутентификации
 */
export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let token;

  // Проверяем наличие токена в заголовке Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Извлекаем токен из заголовка
      token = req.headers.authorization.split(' ')[1];

      // Верифицируем токен
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

      // Находим пользователя по ID из токена (исключаем пароль)
      const user = await UserModel.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Пользователь не найден',
        });
      }

      // Добавляем пользователя к запросу
      req.user = {
        id: decoded.id,
      };

      next();
    } catch (error) {
      console.error('Ошибка верификации токена:', error);
      return res.status(401).json({
        success: false,
        error: 'Невалидный токен',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Доступ запрещен, нет токена аутентификации',
    });
  }
}; 