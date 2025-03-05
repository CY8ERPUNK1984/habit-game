import request from 'supertest';
import { connectDB, closeDB, clearDB } from '../setup';
import express from 'express';
import mongoose from 'mongoose';
import authRoutes from '../../routes/auth.routes';
import UserModel from '../../models/User.model';

// Создаем тестовое приложение Express
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

// Обработчик ошибок
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Внутренняя ошибка сервера',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

describe('Auth API', () => {
  // Подключаемся к тестовой БД перед всеми тестами
  beforeAll(async () => {
    await connectDB();
  });

  // Очищаем БД перед каждым тестом
  beforeEach(async () => {
    await clearDB();
  });

  // Закрываем соединение с БД после всех тестов
  afterAll(async () => {
    await closeDB();
  });

  describe('POST /api/auth/register', () => {
    it('должен успешно зарегистрировать нового пользователя и вернуть токен', async () => {
      const userData = {
        name: 'Тестовый Пользователь',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Проверка формата ответа
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.id).toBeDefined();
      expect(response.body.user.name).toBe(userData.name);
      expect(response.body.user.email).toBe(userData.email);
      
      // Проверка, что пользователь создан в БД
      const savedUser = await UserModel.findOne({ email: userData.email });
      expect(savedUser).not.toBeNull();
      expect(savedUser?.name).toBe(userData.name);
    });

    it('должен возвращать ошибку при отсутствии обязательных полей', async () => {
      // Отсутствует поле name
      const incompleteUserData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(incompleteUserData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
      
      // Проверка, что пользователь не создан в БД
      const savedUser = await UserModel.findOne({ email: incompleteUserData.email });
      expect(savedUser).toBeNull();
    });

    it('должен возвращать ошибку при дублировании email', async () => {
      const userData = {
        name: 'Первый Пользователь',
        email: 'duplicate@example.com',
        password: 'password123'
      };
      
      // Сначала создаем пользователя
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);
      
      // Затем пытаемся создать пользователя с тем же email
      const duplicateUserData = {
        name: 'Второй Пользователь',
        email: 'duplicate@example.com',
        password: 'password456'
      };
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(duplicateUserData)
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
      
      // Проверка, что второй пользователь не создан
      const users = await UserModel.find({ email: userData.email });
      expect(users.length).toBe(1);
    });

    it('должен возвращать ошибку при некорректном формате email', async () => {
      const invalidEmailUserData = {
        name: 'Некорректный Email',
        email: 'invalid-email',
        password: 'password123'
      };
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidEmailUserData)
        .expect(400);
      
      expect(response.body.success).toBe(false);
      
      // Проверка, что пользователь не создан в БД
      const savedUser = await UserModel.findOne({ email: invalidEmailUserData.email });
      expect(savedUser).toBeNull();
    });

    it('должен возвращать ошибку при слишком коротком пароле', async () => {
      const shortPasswordUserData = {
        name: 'Короткий Пароль',
        email: 'short@example.com',
        password: '123' // Менее 8 символов
      };
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(shortPasswordUserData)
        .expect(400);
      
      expect(response.body.success).toBe(false);
      
      // Проверка, что пользователь не создан в БД
      const savedUser = await UserModel.findOne({ email: shortPasswordUserData.email });
      expect(savedUser).toBeNull();
    });
  });
}); 