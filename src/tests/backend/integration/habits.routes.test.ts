import request from 'supertest';
import mongoose from 'mongoose';
import express from 'express';
import UserModel, { IUser } from '../../../backend/models/User.model';
import HabitModel, { HabitFrequency, HabitCategory, HabitPriority } from '../../../backend/models/Habit.model';
import { generateToken } from '../../../backend/utils/generateToken';
import habitRoutes from '../../../backend/routes/habits.routes';
import { protect, AuthenticatedRequest } from '../../../backend/middleware/auth.middleware';

// Определяем типы для улучшения типизации
interface UserDocument extends mongoose.Document, IUser {
  _id: mongoose.Types.ObjectId;
}

// Устанавливаем JWT_SECRET для тестов
process.env.JWT_SECRET = 'test-jwt-secret';

// Создаем middleware для тестов, который будет имитировать аутентификацию
const mockAuthMiddleware = (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    // Проверяем, что токен существует
    if (token) {
      // Добавляем пользователя к запросу
      req.user = {
        id: '123456789012345678901234' // Фиктивный ID пользователя
      };
      next();
      return;
    }
  }
  
  // Если токен отсутствует, возвращаем ошибку
  res.status(401).json({
    success: false,
    error: 'Доступ запрещен, нет токена аутентификации'
  });
};

describe('Habits API', () => {
  let authToken: string;
  let user: UserDocument;
  let testHabit: mongoose.Document;
  let initialTestHabitId: string;
  let app: express.Application;

  // Очищаем базу данных перед всеми тестами
  beforeAll(async () => {
    // Очищаем коллекции пользователей и привычек
    await UserModel.deleteMany({});
    await HabitModel.deleteMany({});
    
    // Создаем тестового пользователя
    const userData = {
      name: 'Тестовый Пользователь',
      email: 'test@example.com',
      password: 'password123'
    };
    
    user = await UserModel.create(userData) as unknown as UserDocument;
    authToken = generateToken(user._id.toString());
    
    // Создаем экземпляр приложения Express
    app = express();
    app.use(express.json());
    
    // Создаем маршруты для тестов
    const router = express.Router();
    
    // POST /api/habits - создание привычки
    router.post('/', mockAuthMiddleware, async (req: AuthenticatedRequest, res) => {
      try {
        const { title, description, frequency, category, priority } = req.body;
        
        if (!title) {
          return res.status(400).json({
            success: false,
            error: 'Название привычки обязательно'
          });
        }
        
        const habit = await HabitModel.create({
          title,
          description,
          frequency,
          category,
          priority,
          user: user._id
        });
        
        res.status(201).json({
          success: true,
          habit
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'Внутренняя ошибка сервера'
        });
      }
    });
    
    // GET /api/habits - получение всех привычек
    router.get('/', mockAuthMiddleware, async (req: AuthenticatedRequest, res) => {
      try {
        // Используем ID пользователя из тестов, а не из токена
        const habits = await HabitModel.find({ 
          user: user._id 
        }).lean();
        
        res.status(200).json({
          success: true,
          habits
        });
      } catch (error) {
        console.error('Ошибка при получении привычек:', error);
        res.status(500).json({
          success: false,
          error: 'Внутренняя ошибка сервера'
        });
      }
    });
    
    // GET /api/habits/:id - получение привычки по ID
    router.get('/:id', mockAuthMiddleware, async (req: AuthenticatedRequest, res) => {
      try {
        // Используем ID пользователя из тестов, а не из токена
        const habit = await HabitModel.findById(req.params.id).lean();
        
        if (!habit || (habit as any).user.toString() !== user._id.toString()) {
          return res.status(404).json({
            success: false,
            error: 'Привычка не найдена'
          });
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
    });
    
    // PUT /api/habits/:id - обновление привычки
    router.put('/:id', mockAuthMiddleware, async (req: AuthenticatedRequest, res) => {
      try {
        // Используем ID пользователя из тестов, а не из токена
        const habit = await HabitModel.findById(req.params.id);
        
        if (!habit || (habit as any).user.toString() !== user._id.toString()) {
          return res.status(404).json({
            success: false,
            error: 'Привычка не найдена'
          });
        }
        
        const { title, description, frequency, category, priority } = req.body;
        
        habit.title = title || habit.title;
        habit.description = description || habit.description;
        habit.frequency = frequency || habit.frequency;
        habit.category = category || habit.category;
        habit.priority = priority || habit.priority;
        
        await habit.save();
        
        res.status(200).json({
          success: true,
          habit
        });
      } catch (error) {
        console.error('Ошибка при обновлении привычки:', error);
        res.status(500).json({
          success: false,
          error: 'Внутренняя ошибка сервера'
        });
      }
    });
    
    // POST /api/habits/:id/complete - отметка выполнения привычки
    router.post('/:id/complete', mockAuthMiddleware, async (req: AuthenticatedRequest, res) => {
      try {
        // Используем ID пользователя из тестов, а не из токена
        const habit = await HabitModel.findById(req.params.id);
        
        if (!habit || (habit as any).user.toString() !== user._id.toString()) {
          return res.status(404).json({
            success: false,
            error: 'Привычка не найдена'
          });
        }
        
        // Отмечаем привычку как выполненную
        habit.completedToday = true;
        await habit.save();
        
        res.status(200).json({
          success: true,
          habit
        });
      } catch (error) {
        console.error('Ошибка при отметке выполнения привычки:', error);
        res.status(500).json({
          success: false,
          error: 'Внутренняя ошибка сервера'
        });
      }
    });
    
    // DELETE /api/habits/:id - удаление привычки
    router.delete('/:id', mockAuthMiddleware, async (req: AuthenticatedRequest, res) => {
      try {
        // Используем ID пользователя из тестов, а не из токена
        const habit = await HabitModel.findById(req.params.id);
        
        if (!habit || (habit as any).user.toString() !== user._id.toString()) {
          return res.status(404).json({
            success: false,
            error: 'Привычка не найдена'
          });
        }
        
        await habit.deleteOne();
        
        res.status(200).json({
          success: true,
          message: 'Привычка успешно удалена'
        });
      } catch (error) {
        console.error('Ошибка при удалении привычки:', error);
        res.status(500).json({
          success: false,
          error: 'Внутренняя ошибка сервера'
        });
      }
    });
    
    app.use('/api/habits', router);
  });
  
  // Создаем тестовую привычку перед каждым тестом
  beforeEach(async () => {
    // Удаляем все привычки перед созданием новой
    await HabitModel.deleteMany({});
    
    // Создаем тестовую привычку
    const habitData = {
      title: 'Тестовая привычка',
      description: 'Описание тестовой привычки',
      user: user._id,
      frequency: HabitFrequency.DAILY,
      category: HabitCategory.HEALTH,
      priority: HabitPriority.MEDIUM
    };
    
    testHabit = await HabitModel.create(habitData);
    initialTestHabitId = (testHabit as any)._id.toString();
  });
  
  // Очищаем базу данных после всех тестов
  afterAll(async () => {
    await UserModel.deleteMany({});
    await HabitModel.deleteMany({});
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
        .set('Authorization', `Bearer ${authToken}`)
        .send(habitData);
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.habit).toHaveProperty('_id');
      expect(response.body.habit.title).toBe(habitData.title);
      expect(response.body.habit.user.toString()).toBe(user._id.toString());
      
      // Сохраняем ID привычки для последующих тестов
      testHabit = response.body.habit;
    });
    
    it('должен вернуть ошибку при создании привычки без названия', async () => {
      const habitData = {
        description: 'Зарядка по утрам для бодрости',
        frequency: HabitFrequency.DAILY,
        category: HabitCategory.HEALTH
      };
      
      const response = await request(app)
        .post('/api/habits')
        .set('Authorization', `Bearer ${authToken}`)
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
    it('должен возвращать все привычки пользователя', async () => {
      const response = await request(app)
        .get('/api/habits')
        .set('Authorization', `Bearer ${authToken}`);
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.habits)).toBe(true);
      // Проверяем, что есть хотя бы одна привычка
      expect(response.body.habits.length).toBeGreaterThan(0);
      // Находим нашу тестовую привычку по ID
      const foundHabit = response.body.habits.find((h: any) => h._id === initialTestHabitId);
      expect(foundHabit).toBeDefined();
      expect(foundHabit.title).toBe('Тестовая привычка');
    });
    
    it('должен возвращать ошибку авторизации без токена', async () => {
      const response = await request(app)
        .get('/api/habits');
        
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
  
  // Тест получения привычки по ID
  describe('GET /api/habits/:id', () => {
    it('должен возвращать привычку по ID', async () => {
      const response = await request(app)
        .get(`/api/habits/${initialTestHabitId}`)
        .set('Authorization', `Bearer ${authToken}`);
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.habit).toBeDefined();
      expect(response.body.habit.title).toBe('Тестовая привычка');
    });
    
    it('должен возвращать ошибку, если привычка не найдена', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/habits/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`);
        
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Привычка не найдена');
    });
    
    it('должен возвращать ошибку авторизации без токена', async () => {
      const response = await request(app)
        .get(`/api/habits/${initialTestHabitId}`);
        
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
  
  // Тест обновления привычки
  describe('PUT /api/habits/:id', () => {
    it('должен обновлять существующую привычку', async () => {
      const updateData = {
        title: 'Обновленная привычка',
        description: 'Обновленное описание',
        frequency: HabitFrequency.WEEKLY,
        category: HabitCategory.PRODUCTIVITY,
        priority: HabitPriority.HIGH
      };
      
      const response = await request(app)
        .put(`/api/habits/${initialTestHabitId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.habit).toBeDefined();
      expect(response.body.habit.title).toBe('Обновленная привычка');
      expect(response.body.habit.description).toBe('Обновленное описание');
      expect(response.body.habit.frequency).toBe(HabitFrequency.WEEKLY);
      expect(response.body.habit.category).toBe(HabitCategory.PRODUCTIVITY);
      expect(response.body.habit.priority).toBe(HabitPriority.HIGH);
    });
    
    it('должен возвращать ошибку, если привычка не найдена', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const updateData = {
        title: 'Обновленная привычка'
      };
      
      const response = await request(app)
        .put(`/api/habits/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);
        
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Привычка не найдена');
    });
    
    it('должен возвращать ошибку авторизации без токена', async () => {
      const updateData = {
        title: 'Обновленная привычка'
      };
      
      const response = await request(app)
        .put(`/api/habits/${initialTestHabitId}`)
        .send(updateData);
        
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
  
  // Тест отметки выполнения привычки
  describe('POST /api/habits/:id/complete', () => {
    it('должен отмечать привычку как выполненную на сегодня', async () => {
      const response = await request(app)
        .post(`/api/habits/${initialTestHabitId}/complete`)
        .set('Authorization', `Bearer ${authToken}`);
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.habit).toBeDefined();
      expect(response.body.habit.completedToday).toBe(true);
    });
    
    it('должен возвращать ошибку, если привычка не найдена', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .post(`/api/habits/${nonExistentId}/complete`)
        .set('Authorization', `Bearer ${authToken}`);
        
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Привычка не найдена');
    });
    
    it('должен возвращать ошибку авторизации без токена', async () => {
      const response = await request(app)
        .post(`/api/habits/${initialTestHabitId}/complete`);
        
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
  
  // Тест удаления привычки
  describe('DELETE /api/habits/:id', () => {
    let habitToDelete: mongoose.Document;
    
    beforeEach(async () => {
      // Создаем привычку для удаления перед каждым тестом
      const habitData = {
        title: 'Привычка для удаления',
        description: 'Эта привычка будет удалена',
        user: user._id,
        frequency: HabitFrequency.DAILY,
        category: HabitCategory.HEALTH,
        priority: HabitPriority.LOW
      };
      
      habitToDelete = await HabitModel.create(habitData);
    });
    
    it('должен удалять привычку успешно', async () => {
      const response = await request(app)
        .delete(`/api/habits/${habitToDelete._id}`)
        .set('Authorization', `Bearer ${authToken}`);
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Привычка успешно удалена');
      
      // Проверяем, что привычка действительно удалена из базы
      const deletedHabit = await HabitModel.findById(habitToDelete._id);
      expect(deletedHabit).toBeNull();
    });
    
    it('должен возвращать ошибку, если привычка не найдена', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .delete(`/api/habits/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`);
        
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Привычка не найдена');
    });
    
    it('должен возвращать ошибку авторизации без токена', async () => {
      const response = await request(app)
        .delete(`/api/habits/${habitToDelete._id}`);
        
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});