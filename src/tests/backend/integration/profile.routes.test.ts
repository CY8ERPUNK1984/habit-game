import express from 'express';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { UserModel } from '../../../backend/models/User.model';
import jwt from 'jsonwebtoken';

// Мокаем .env для секретного ключа
jest.mock('../../../backend/config/config', () => ({
  JWT_SECRET: 'test-secret-key',
  JWT_EXPIRE: '1h'
}));

describe('Profile Routes', () => {
  let app: express.Application;
  let mongoServer: MongoMemoryServer;
  let testUser: any; // Пользователь для тестов
  let authToken: string; // Токен аутентификации
  
  beforeAll(async () => {
    // Запуск в памяти MongoDB сервера
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // Подключение к тестовой БД
    await mongoose.connect(mongoUri);
    
    // Создание приложения
    app = express();
    app.use(express.json());
    
    // Подключение роутов
    app.use('/api/profile', require('../../../backend/routes/profile.routes'));
    
    // Создание тестового пользователя
    testUser = await UserModel.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!'
    });
    
    // Создание токена
    authToken = jwt.sign(
      { id: testUser._id },
      'test-secret-key',
      { expiresIn: '1h' }
    );
  });
  
  afterAll(async () => {
    // Отключение от БД и остановка MongoDB сервера
    await mongoose.disconnect();
    await mongoServer.stop();
  });
  
  describe('GET /api/profile', () => {
    it('должен получить профиль пользователя при наличии токена', async () => {
      const response = await request(app)
        .get('/api/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('name', 'Test User');
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
      expect(response.body.user).toHaveProperty('level');
      expect(response.body.user).toHaveProperty('experience');
      expect(response.body.user).not.toHaveProperty('password');
    });
    
    it('должен вернуть 401, если токен не предоставлен', async () => {
      const response = await request(app)
        .get('/api/profile')
        .expect(401);
      
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('авторизация');
    });
    
    it('должен вернуть 401, если токен недействителен', async () => {
      const response = await request(app)
        .get('/api/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
      
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('недействительный');
    });
  });
  
  describe('PUT /api/profile', () => {
    it('должен обновить профиль пользователя', async () => {
      const updatedData = {
        name: 'Updated User',
        avatar: 'new-avatar.png'
      };
      
      const response = await request(app)
        .put('/api/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedData)
        .expect(200);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Профиль успешно обновлен');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('name', 'Updated User');
      expect(response.body.user).toHaveProperty('avatar', 'new-avatar.png');
      
      // Проверяем, что пользователь обновлен в БД
      const updatedUser = await UserModel.findById(testUser._id);
      expect(updatedUser?.name).toBe('Updated User');
      expect(updatedUser?.avatar).toBe('new-avatar.png');
    });
    
    it('должен вернуть 400, если данные некорректны', async () => {
      const invalidData = {
        name: '' // Пустое имя
      };
      
      const response = await request(app)
        .put('/api/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);
      
      expect(response.body).toHaveProperty('success', false);
    });
    
    it('должен вернуть 401, если токен не предоставлен', async () => {
      const response = await request(app)
        .put('/api/profile')
        .send({ name: 'New Name' })
        .expect(401);
      
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('авторизация');
    });
  });
}); 