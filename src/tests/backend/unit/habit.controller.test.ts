import { Request, Response } from 'express';
import { createHabit, getHabits, getHabitById, updateHabit, deleteHabit } from '../../../backend/controllers/habit.controller';
import HabitModel, { HabitFrequency, HabitCategory, HabitPriority } from '../../../backend/models/Habit.model';
import mongoose from 'mongoose';
import { AuthenticatedRequest } from '../../../backend/middleware/auth.middleware';

// Мокаем модель привычки
jest.mock('../../../backend/models/Habit.model');

describe('Habit Controller', () => {
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  
  beforeEach(() => {
    // Сбрасываем моки перед каждым тестом
    jest.clearAllMocks();
    
    // Создаём мок для запроса
    mockRequest = {
      body: {},
      user: { id: 'user123' },
      params: {}
    };
    
    // Создаём мок для ответа
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });
  
  describe('createHabit', () => {
    it('должен создать новую привычку для авторизованного пользователя', async () => {
      // Настраиваем данные для теста
      const habitData = {
        title: 'Утренняя зарядка',
        description: 'Зарядка по утрам для бодрости',
        frequency: HabitFrequency.DAILY,
        category: HabitCategory.HEALTH,
        priority: HabitPriority.MEDIUM
      };
      
      mockRequest.body = habitData;
      
      const mockSavedHabit = {
        _id: 'habit123',
        ...habitData,
        user: 'user123',
        streak: 0,
        completedToday: false,
        completionHistory: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Мокаем создание новой привычки
      (HabitModel.create as jest.Mock).mockResolvedValueOnce(mockSavedHabit);
      
      // Вызываем функцию контроллера
      await createHabit(
        mockRequest as AuthenticatedRequest, 
        mockResponse as Response
      );
      
      // Проверяем, что привычка создана с правильными данными
      expect(HabitModel.create).toHaveBeenCalledWith({
        ...habitData,
        user: 'user123'
      });
      
      // Проверяем, что ответ отправлен с правильным статусом и данными
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        habit: mockSavedHabit
      });
    });
    
    it('должен вернуть ошибку, если название привычки не указано', async () => {
      // Настраиваем данные для теста без названия
      const habitData = {
        description: 'Зарядка по утрам для бодрости',
        frequency: HabitFrequency.DAILY,
        category: HabitCategory.HEALTH
      };
      
      mockRequest.body = habitData;
      
      // Вызываем функцию контроллера
      await createHabit(
        mockRequest as AuthenticatedRequest, 
        mockResponse as Response
      );
      
      // Проверяем, что ответ отправлен с ошибкой
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Название привычки обязательно'
      });
      
      // Проверяем, что привычка не создана
      expect(HabitModel.create).not.toHaveBeenCalled();
    });
    
    it('должен обрабатывать ошибки базы данных', async () => {
      // Настраиваем данные для теста
      const habitData = {
        title: 'Утренняя зарядка',
        description: 'Зарядка по утрам для бодрости',
        frequency: HabitFrequency.DAILY,
        category: HabitCategory.HEALTH
      };
      
      mockRequest.body = habitData;
      
      // Мокаем ошибку при создании
      const errorMessage = 'Ошибка базы данных';
      (HabitModel.create as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
      
      // Вызываем функцию контроллера
      await createHabit(
        mockRequest as AuthenticatedRequest, 
        mockResponse as Response
      );
      
      // Проверяем, что ответ отправлен с ошибкой
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Внутренняя ошибка сервера'
      });
    });
    
    it('должен вернуть ошибку, если привычка с таким названием уже существует', async () => {
      // Настраиваем данные для теста
      const habitData = {
        title: 'Существующая привычка',
        frequency: HabitFrequency.DAILY,
        category: HabitCategory.HEALTH
      };
      
      mockRequest.body = habitData;
      
      // Мокаем ошибку MongoDB о дубликате
      const duplicateError: any = new Error('Duplicate key error');
      duplicateError.code = 11000;
      duplicateError.keyPattern = { user: 1, title: 1 };
      
      (HabitModel.create as jest.Mock).mockRejectedValueOnce(duplicateError);
      
      // Вызываем функцию контроллера
      await createHabit(
        mockRequest as AuthenticatedRequest, 
        mockResponse as Response
      );
      
      // Проверяем, что ответ отправлен с ошибкой о дубликате
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Привычка с таким названием уже существует'
      });
    });
  });
  
  describe('getHabits', () => {
    it('должен возвращать список привычек пользователя', async () => {
      // Мокаем данные привычек
      const mockHabits = [
        {
          _id: 'habit1',
          title: 'Утренняя зарядка',
          description: 'Зарядка по утрам для бодрости',
          user: 'user123',
          frequency: HabitFrequency.DAILY,
          category: HabitCategory.HEALTH
        },
        {
          _id: 'habit2',
          title: 'Чтение книг',
          description: 'Чтение перед сном',
          user: 'user123',
          frequency: HabitFrequency.DAILY,
          category: HabitCategory.EDUCATION
        }
      ];
      
      // Мокаем метод find и его цепочку
      const mockFind = jest.fn().mockReturnThis();
      const mockSort = jest.fn().mockReturnThis();
      const mockExec = jest.fn().mockResolvedValueOnce(mockHabits);
      
      // Подменяем методы на моки
      (HabitModel.find as jest.Mock) = mockFind;
      mockFind.mockReturnValue({
        sort: mockSort,
        exec: mockExec
      });
      
      // Вызываем функцию контроллера
      await getHabits(
        mockRequest as AuthenticatedRequest, 
        mockResponse as Response
      );
      
      // Проверяем, что find вызван с правильными параметрами
      expect(mockFind).toHaveBeenCalledWith({ user: 'user123' });
      
      // Проверяем, что sort вызван и сортировка идет по дате создания
      expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
      
      // Проверяем, что ответ отправлен с правильным статусом и данными
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        habits: mockHabits
      });
    });
    
    it('должен обрабатывать ошибки при получении списка привычек', async () => {
      // Мокаем ошибку при запросе
      const errorMessage = 'Ошибка базы данных';
      const mockFind = jest.fn().mockReturnThis();
      const mockSort = jest.fn().mockReturnThis();
      const mockExec = jest.fn().mockRejectedValueOnce(new Error(errorMessage));
      
      // Подменяем методы на моки
      (HabitModel.find as jest.Mock) = mockFind;
      mockFind.mockReturnValue({
        sort: mockSort,
        exec: mockExec
      });
      
      // Вызываем функцию контроллера
      await getHabits(
        mockRequest as AuthenticatedRequest, 
        mockResponse as Response
      );
      
      // Проверяем, что ответ отправлен с ошибкой
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Внутренняя ошибка сервера'
      });
    });
  });
  
  describe('getHabitById', () => {
    it('должен возвращать привычку по ID', async () => {
      // Настраиваем параметры запроса
      mockRequest.params = { id: 'habit123' };
      
      // Мокаем данные привычки
      const mockHabit = {
        _id: 'habit123',
        title: 'Утренняя зарядка',
        description: 'Зарядка по утрам для бодрости',
        user: 'user123',
        frequency: HabitFrequency.DAILY,
        category: HabitCategory.HEALTH,
        priority: HabitPriority.MEDIUM,
        streak: 0,
        completedToday: false,
        completionHistory: []
      };
      
      // Мокаем метод findById
      const mockFindById = jest.fn().mockReturnThis();
      const mockExec = jest.fn().mockResolvedValueOnce(mockHabit);
      
      // Подменяем методы на моки
      (HabitModel.findById as jest.Mock) = mockFindById;
      mockFindById.mockReturnValue({ exec: mockExec });
      
      // Вызываем функцию контроллера
      await getHabitById(
        mockRequest as AuthenticatedRequest, 
        mockResponse as Response
      );
      
      // Проверяем, что findById вызван с правильными параметрами
      expect(mockFindById).toHaveBeenCalledWith('habit123');
      
      // Проверяем, что ответ отправлен с правильным статусом и данными
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        habit: mockHabit
      });
    });
    
    it('должен возвращать ошибку, если привычка не найдена', async () => {
      // Настраиваем параметры запроса
      mockRequest.params = { id: 'nonexistent' };
      
      // Мокаем метод findById, который не находит привычку
      const mockFindById = jest.fn().mockReturnThis();
      const mockExec = jest.fn().mockResolvedValueOnce(null);
      
      // Подменяем методы на моки
      (HabitModel.findById as jest.Mock) = mockFindById;
      mockFindById.mockReturnValue({ exec: mockExec });
      
      // Вызываем функцию контроллера
      await getHabitById(
        mockRequest as AuthenticatedRequest, 
        mockResponse as Response
      );
      
      // Проверяем, что ответ отправлен с ошибкой
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Привычка не найдена'
      });
    });
    
    it('должен проверять, что привычка принадлежит пользователю', async () => {
      // Настраиваем параметры запроса
      mockRequest.params = { id: 'habit456' };
      
      // Мокаем данные привычки, которая принадлежит другому пользователю
      const mockHabit = {
        _id: 'habit456',
        title: 'Чужая привычка',
        user: 'other_user',
        frequency: HabitFrequency.DAILY,
        category: HabitCategory.HEALTH
      };
      
      // Мокаем метод findById
      const mockFindById = jest.fn().mockReturnThis();
      const mockExec = jest.fn().mockResolvedValueOnce(mockHabit);
      
      // Подменяем методы на моки
      (HabitModel.findById as jest.Mock) = mockFindById;
      mockFindById.mockReturnValue({ exec: mockExec });
      
      // Вызываем функцию контроллера
      await getHabitById(
        mockRequest as AuthenticatedRequest, 
        mockResponse as Response
      );
      
      // Проверяем, что ответ отправлен с ошибкой доступа
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Нет доступа к этой привычке'
      });
    });
    
    it('должен обрабатывать ошибки базы данных', async () => {
      // Настраиваем параметры запроса
      mockRequest.params = { id: 'habit123' };
      
      // Мокаем ошибку при запросе
      const errorMessage = 'Ошибка базы данных';
      const mockFindById = jest.fn().mockReturnThis();
      const mockExec = jest.fn().mockRejectedValueOnce(new Error(errorMessage));
      
      // Подменяем методы на моки
      (HabitModel.findById as jest.Mock) = mockFindById;
      mockFindById.mockReturnValue({ exec: mockExec });
      
      // Вызываем функцию контроллера
      await getHabitById(
        mockRequest as AuthenticatedRequest, 
        mockResponse as Response
      );
      
      // Проверяем, что ответ отправлен с ошибкой
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Внутренняя ошибка сервера'
      });
    });
  });
  
  describe('updateHabit', () => {
    it('должен обновлять привычку успешно', async () => {
      // Настраиваем параметры запроса
      mockRequest.params = { id: 'habit123' };
      
      // Данные для обновления
      const updateData = {
        title: 'Обновленная привычка',
        description: 'Новое описание',
        frequency: HabitFrequency.WEEKLY,
        category: HabitCategory.EDUCATION,
        priority: HabitPriority.HIGH
      };
      
      mockRequest.body = updateData;
      
      // Мокаем существующую привычку
      const existingHabit = {
        _id: 'habit123',
        title: 'Старая привычка',
        description: 'Старое описание',
        user: 'user123',
        frequency: HabitFrequency.DAILY,
        category: HabitCategory.HEALTH,
        priority: HabitPriority.MEDIUM
      };
      
      // Мокаем обновленную привычку
      const updatedHabit = {
        ...existingHabit,
        ...updateData
      };
      
      // Мокаем метод findById
      const mockFindById = jest.fn().mockReturnThis();
      const mockExec = jest.fn().mockResolvedValueOnce(existingHabit);
      
      // Мокаем метод findByIdAndUpdate
      const mockFindByIdAndUpdate = jest.fn().mockReturnThis();
      const mockExecUpdate = jest.fn().mockResolvedValueOnce(updatedHabit);
      
      // Подменяем методы на моки
      (HabitModel.findById as jest.Mock) = mockFindById;
      mockFindById.mockReturnValue({ exec: mockExec });
      
      (HabitModel.findByIdAndUpdate as jest.Mock) = mockFindByIdAndUpdate;
      mockFindByIdAndUpdate.mockReturnValue({ exec: mockExecUpdate });
      
      // Вызываем функцию контроллера
      await updateHabit(
        mockRequest as AuthenticatedRequest, 
        mockResponse as Response
      );
      
      // Проверяем, что findById вызван с правильными параметрами
      expect(mockFindById).toHaveBeenCalledWith('habit123');
      
      // Проверяем, что findByIdAndUpdate вызван с правильными параметрами
      expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
        'habit123',
        updateData,
        { new: true }
      );
      
      // Проверяем, что ответ отправлен с правильным статусом и данными
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        habit: updatedHabit
      });
    });
    
    it('должен возвращать ошибку, если привычка не найдена', async () => {
      // Настраиваем параметры запроса
      mockRequest.params = { id: 'nonexistent' };
      
      // Данные для обновления
      const updateData = {
        title: 'Обновленная привычка'
      };
      
      mockRequest.body = updateData;
      
      // Мокаем метод findById, который не находит привычку
      const mockFindById = jest.fn().mockReturnThis();
      const mockExec = jest.fn().mockResolvedValueOnce(null);
      
      // Подменяем методы на моки
      (HabitModel.findById as jest.Mock) = mockFindById;
      mockFindById.mockReturnValue({ exec: mockExec });
      
      // Вызываем функцию контроллера
      await updateHabit(
        mockRequest as AuthenticatedRequest, 
        mockResponse as Response
      );
      
      // Проверяем, что ответ отправлен с ошибкой
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Привычка не найдена'
      });
    });
    
    it('должен проверять, что привычка принадлежит пользователю', async () => {
      // Настраиваем параметры запроса
      mockRequest.params = { id: 'habit456' };
      
      // Данные для обновления
      const updateData = {
        title: 'Обновленная привычка'
      };
      
      mockRequest.body = updateData;
      
      // Мокаем данные привычки, которая принадлежит другому пользователю
      const mockHabit = {
        _id: 'habit456',
        title: 'Чужая привычка',
        user: 'other_user',
        frequency: HabitFrequency.DAILY,
        category: HabitCategory.HEALTH
      };
      
      // Мокаем метод findById
      const mockFindById = jest.fn().mockReturnThis();
      const mockExec = jest.fn().mockResolvedValueOnce(mockHabit);
      
      // Подменяем методы на моки
      (HabitModel.findById as jest.Mock) = mockFindById;
      mockFindById.mockReturnValue({ exec: mockExec });
      
      // Вызываем функцию контроллера
      await updateHabit(
        mockRequest as AuthenticatedRequest, 
        mockResponse as Response
      );
      
      // Проверяем, что ответ отправлен с ошибкой доступа
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Нет доступа к этой привычке'
      });
    });
  });
  
  describe('deleteHabit', () => {
    it('должен удалять привычку успешно', async () => {
      // Настраиваем параметры запроса
      mockRequest.params = { id: 'habit123' };
      
      // Мокаем существующую привычку
      const existingHabit = {
        _id: 'habit123',
        title: 'Привычка для удаления',
        user: 'user123',
        frequency: HabitFrequency.DAILY,
        category: HabitCategory.HEALTH
      };
      
      // Мокаем метод findById
      const mockFindById = jest.fn().mockReturnThis();
      const mockExec = jest.fn().mockResolvedValueOnce(existingHabit);
      
      // Мокаем метод findByIdAndDelete
      const mockFindByIdAndDelete = jest.fn().mockReturnThis();
      const mockExecDelete = jest.fn().mockResolvedValueOnce(existingHabit);
      
      // Подменяем методы на моки
      (HabitModel.findById as jest.Mock) = mockFindById;
      mockFindById.mockReturnValue({ exec: mockExec });
      
      (HabitModel.findByIdAndDelete as jest.Mock) = mockFindByIdAndDelete;
      mockFindByIdAndDelete.mockReturnValue({ exec: mockExecDelete });
      
      // Вызываем функцию контроллера
      await deleteHabit(
        mockRequest as AuthenticatedRequest, 
        mockResponse as Response
      );
      
      // Проверяем, что findById вызван с правильными параметрами
      expect(mockFindById).toHaveBeenCalledWith('habit123');
      
      // Проверяем, что findByIdAndDelete вызван с правильными параметрами
      expect(mockFindByIdAndDelete).toHaveBeenCalledWith('habit123');
      
      // Проверяем, что ответ отправлен с правильным статусом и данными
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Привычка успешно удалена'
      });
    });
    
    it('должен возвращать ошибку, если привычка не найдена', async () => {
      // Настраиваем параметры запроса
      mockRequest.params = { id: 'nonexistent' };
      
      // Мокаем метод findById, который не находит привычку
      const mockFindById = jest.fn().mockReturnThis();
      const mockExec = jest.fn().mockResolvedValueOnce(null);
      
      // Подменяем методы на моки
      (HabitModel.findById as jest.Mock) = mockFindById;
      mockFindById.mockReturnValue({ exec: mockExec });
      
      // Вызываем функцию контроллера
      await deleteHabit(
        mockRequest as AuthenticatedRequest, 
        mockResponse as Response
      );
      
      // Проверяем, что ответ отправлен с ошибкой
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Привычка не найдена'
      });
    });
    
    it('должен проверять, что привычка принадлежит пользователю', async () => {
      // Настраиваем параметры запроса
      mockRequest.params = { id: 'habit456' };
      
      // Мокаем данные привычки, которая принадлежит другому пользователю
      const mockHabit = {
        _id: 'habit456',
        title: 'Чужая привычка',
        user: 'other_user',
        frequency: HabitFrequency.DAILY,
        category: HabitCategory.HEALTH
      };
      
      // Мокаем метод findById
      const mockFindById = jest.fn().mockReturnThis();
      const mockExec = jest.fn().mockResolvedValueOnce(mockHabit);
      
      // Подменяем методы на моки
      (HabitModel.findById as jest.Mock) = mockFindById;
      mockFindById.mockReturnValue({ exec: mockExec });
      
      // Вызываем функцию контроллера
      await deleteHabit(
        mockRequest as AuthenticatedRequest, 
        mockResponse as Response
      );
      
      // Проверяем, что ответ отправлен с ошибкой доступа
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Нет доступа к этой привычке'
      });
    });
  });
}); 