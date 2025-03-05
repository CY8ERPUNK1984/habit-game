import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../../backend/index';
import UserModel from '../../../backend/models/User.model';
import HabitModel, { HabitFrequency, HabitCategory, HabitPriority } from '../../../backend/models/Habit.model';
import jwt from 'jsonwebtoken';

// Локальная функция для генерации токена (дублирует функционал из utils/generateToken.ts)
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d'
  });
};

// Интерфейс для результата создания пользователя
interface UserDocument {
  _id: mongoose.Types.ObjectId;
  [key: string]: any;
}

describe('Habits API', () => {
  let token: string;
  let userId: string;
  let habitId: string;
  
  // Перед всеми тестами создаем тестового пользователя
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/habit-game-test');
    
    // Очищаем коллекции перед тестами
    await UserModel.deleteMany({});
    await HabitModel.deleteMany({});
    
    // Создаем тестового пользователя
    const userData = {
      name: 'Тестовый Пользователь',
      email: 'test@example.com',
      password: 'password123'
    };
    
    // Создаем пользователя и получаем его ID
    const user = await UserModel.create(userData) as UserDocument;
    userId = user._id.toString();
    
    // Генерируем токен для пользователя
    token = generateToken(userId);
  });
  
  // После всех тестов отключаемся от базы данных
  afterAll(async () => {
    await mongoose.connection.close();
  });
  
  // Тест создания новой привычки
  describe('POST /api/habits', () => {
    it('должен создать новую привычку для авторизованного пользователя', async () => {
      const habitData = {
        title: 'Утренняя зарядка',
        description: 'Зарядка по утрам для бодрости',
        frequency: HabitFrequency.DAILY,
        category: HabitCategory.HEALTH,
        priority: HabitPriority.MEDIUM
      };
      
      const response = await request(app)
        .post('/api/habits')
        .set('Authorization', `Bearer ${token}`)
        .send(habitData);
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.habit).toHaveProperty('_id');
      expect(response.body.habit.title).toBe(habitData.title);
      expect(response.body.habit.user.toString()).toBe(userId);
      
      // Сохраняем ID привычки для последующих тестов
      habitId = response.body.habit._id;
    });
    
    it('должен вернуть ошибку при создании привычки без названия', async () => {
      const habitData = {
        description: 'Зарядка по утрам для бодрости',
        frequency: HabitFrequency.DAILY,
        category: HabitCategory.HEALTH
      };
      
      const response = await request(app)
        .post('/api/habits')
        .set('Authorization', `Bearer ${token}`)
        .send(habitData);
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Название привычки обязательно');
    });
    
    it('должен вернуть ошибку при создании привычки без авторизации', async () => {
      const habitData = {
        title: 'Утренняя зарядка',
        description: 'Зарядка по утрам для бодрости',
        frequency: HabitFrequency.DAILY,
        category: HabitCategory.HEALTH
      };
      
      const response = await request(app)
        .post('/api/habits')
        .send(habitData);
      
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
  
  // Тест получения списка привычек
  describe('GET /api/habits', () => {
    it('должен вернуть список привычек пользователя', async () => {
      const response = await request(app)
        .get('/api/habits')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.habits)).toBe(true);
      expect(response.body.habits.length).toBeGreaterThan(0);
    });
    
    it('должен вернуть ошибку при запросе без авторизации', async () => {
      const response = await request(app)
        .get('/api/habits');
      
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
  
  // Тест получения привычки по ID
  describe('GET /api/habits/:id', () => {
    it('должен вернуть привычку по ID', async () => {
      const response = await request(app)
        .get(`/api/habits/${habitId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.habit).toHaveProperty('_id', habitId);
    });
    
    it('должен вернуть ошибку при запросе несуществующей привычки', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      
      const response = await request(app)
        .get(`/api/habits/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Привычка не найдена');
    });
  });
  
  // Тест обновления привычки
  describe('PUT /api/habits/:id', () => {
    it('должен обновить существующую привычку', async () => {
      const updatedData = {
        title: 'Обновленная привычка',
        description: 'Новое описание',
        frequency: HabitFrequency.WEEKLY,
        category: HabitCategory.EDUCATION,
        priority: HabitPriority.HIGH
      };
      
      const response = await request(app)
        .put(`/api/habits/${habitId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedData);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.habit.title).toBe(updatedData.title);
      expect(response.body.habit.description).toBe(updatedData.description);
      expect(response.body.habit.frequency).toBe(updatedData.frequency);
    });
  });
  
  // Тест отметки выполнения привычки
  describe('POST /api/habits/:id/complete', () => {
    it('должен отметить привычку как выполненную', async () => {
      const response = await request(app)
        .post(`/api/habits/${habitId}/complete`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.habit.completedToday).toBe(true);
      expect(response.body.habit.streak).toBeGreaterThan(0);
      expect(response.body.habit.completionHistory.length).toBeGreaterThan(0);
    });
    
    it('должен вернуть ошибку при повторной отметке выполнения в тот же день', async () => {
      const response = await request(app)
        .post(`/api/habits/${habitId}/complete`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Привычка уже отмечена как выполненная сегодня');
    });
  });
  
  // Тест удаления привычки
  describe('DELETE /api/habits/:id', () => {
    it('должен удалить привычку', async () => {
      const response = await request(app)
        .delete(`/api/habits/${habitId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Привычка успешно удалена');
      
      // Проверяем, что привычка действительно удалена
      const checkResponse = await request(app)
        .get(`/api/habits/${habitId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(checkResponse.status).toBe(404);
    });
  });
}); 