import { Request, Response } from 'express';
import { createHabit, getHabits } from '../../../backend/controllers/habit.controller';
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
      user: { id: 'user123' }
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
}); 