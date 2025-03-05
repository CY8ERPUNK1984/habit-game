import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User.model';

// Интерфейс для расширения Request типа Express
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Middleware для защиты маршрутов
export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  // Проверяем наличие токена в заголовках
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Получаем токен из заголовка
      token = req.headers.authorization.split(' ')[1];

      // Проверяем токен
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_jwt_secret') as jwt.JwtPayload;

      // Получаем пользователя и исключаем пароль из результата
      req.user = await UserModel.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Не авторизован, токен недействителен'
      });
    }
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Не авторизован, токен отсутствует'
    });
  }
}; 