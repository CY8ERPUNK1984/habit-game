import { Request, Response, NextFunction } from 'express';
import UserModel from '../models/User.model';
import jwt from 'jsonwebtoken';

// Контроллер для регистрации пользователя
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    // Проверка наличия всех обязательных полей
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Все поля обязательны для заполнения'
      });
    }

    // Проверка, существует ли пользователь с таким email
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Пользователь с таким email уже существует'
      });
    }

    // Создание нового пользователя
    const user = await UserModel.create({
      name,
      email,
      password
    });

    // Создание JWT токена
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'default_jwt_secret',
      { expiresIn: '30d' }
    );

    // Возвращаем успешный ответ с JWT токеном
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        level: user.level,
        experience: user.experience,
        avatar: user.avatar
      }
    });
  } catch (error) {
    next(error);
  }
};

// Контроллер для авторизации пользователя
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Проверка наличия всех обязательных полей
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Все поля обязательны для заполнения'
      });
    }

    // Находим пользователя по email и включаем поле password
    const user = await UserModel.findOne({ email }).select('+password');

    // Если пользователь не найден
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Неверные учетные данные'
      });
    }

    // Проверка пароля
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Неверные учетные данные'
      });
    }

    // Создание JWT токена
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'default_jwt_secret',
      { expiresIn: '30d' }
    );

    // Возвращаем успешный ответ с JWT токеном
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        level: user.level,
        experience: user.experience,
        avatar: user.avatar
      }
    });
  } catch (error) {
    next(error);
  }
};

// Контроллер для получения профиля текущего пользователя
export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // req.user должен быть установлен в middleware аутентификации
    const userId = (req as any).user.id;
    
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        level: user.level,
        experience: user.experience,
        avatar: user.avatar
      }
    });
  } catch (error) {
    next(error);
  }
}; 