import request from 'supertest';
import express from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { UserModel } from '../../../backend/models/User.model';
import { authRoutes } from '../../../backend/routes/auth.routes';

describe('Auth Routes', () => {
  let app: express.Application;
  let mongoServer: MongoMemoryServer;
  
  beforeAll(async () => {
    // Создаем тестовую БД в памяти
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // Подключаемся к тестовой БД
    await mongoose.connect(mongoUri);
    
    // Создаем экземпляр приложения
    app = express();
    app.use(express.json());
    app.use('/api/auth', authRoutes);
  });
  
  afterAll(async () => {
    // Отключаемся от тестовой БД
    await mongoose.disconnect();
    await mongoServer.stop();
  });
  
  beforeEach(async () => {
    // Очищаем коллекцию перед каждым тестом
    await UserModel.deleteMany({});
  });
  
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User'
      };
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Пользователь успешно зарегистрирован');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', userData.email);
      expect(response.body.user).toHaveProperty('name', userData.name);
      expect(response.body.user).not.toHaveProperty('password');
      
      // Проверка создания пользователя в БД
      const usersCount = await UserModel.countDocuments();
      expect(usersCount).toBe(1);
    });
    
    it('should return 400 if user already exists', async () => {
      // Создаем пользователя
      const userData = {
        email: 'existing@example.com',
        password: 'Password123!',
        name: 'Existing User'
      };
      
      // Сначала создаем пользователя
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);
      
      // Пытаемся создать пользователя с тем же email
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);
      
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('уже существует');
    });
    
    it('should return 400 if email is invalid', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'Password123!',
        name: 'Test User'
      };
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);
      
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('email');
    });
  });
  
  describe('POST /api/auth/login', () => {
    it('should login user successfully', async () => {
      // Создаем пользователя
      const userData = {
        email: 'login@example.com',
        password: 'Password123!',
        name: 'Login User'
      };
      
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);
      
      // Пытаемся залогиниться
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        })
        .expect(200);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Успешная авторизация');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', userData.email);
      expect(response.body.user).toHaveProperty('name', userData.name);
      
      // Проверка наличия cookie с токеном
      expect(response.headers['set-cookie']).toBeDefined();
      expect(response.headers['set-cookie'][0]).toContain('token=');
    });
    
    it('should return 401 if credentials are invalid', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'WrongPassword'
        })
        .expect(401);
      
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('Неверные учетные данные');
    });
  });
}); 