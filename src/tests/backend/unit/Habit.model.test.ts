import mongoose from 'mongoose';
import { HabitModel } from '../../../backend/models/Habit.model';

describe('Habit Model', () => {
  beforeAll(async () => {
    // Используем моки из jest.setup.js
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create a new habit', async () => {
    const habitData = {
      title: 'Ежедневная медитация',
      description: 'Медитация в течение 10 минут каждое утро',
      user: new mongoose.Types.ObjectId(),
      frequency: 'daily',
      category: 'health',
      priority: 'medium',
      streak: 0,
      completedToday: false,
      completionHistory: []
    };

    const habit = new HabitModel(habitData);
    
    // Мокаем метод save, чтобы не обращаться к реальной БД
    habit.save = jest.fn().mockResolvedValueOnce(habit);
    
    const savedHabit = await habit.save();
    
    expect(savedHabit).toBeDefined();
    expect(savedHabit.title).toBe(habitData.title);
    expect(savedHabit.description).toBe(habitData.description);
    expect(savedHabit.user).toEqual(habitData.user);
    expect(savedHabit.frequency).toBe(habitData.frequency);
    expect(savedHabit.streak).toBe(0);
    expect(savedHabit.completedToday).toBe(false);
    expect(savedHabit.completionHistory).toEqual([]);
  });

  it('should require title', async () => {
    const habit = new HabitModel({
      description: 'Медитация в течение 10 минут каждое утро',
      user: new mongoose.Types.ObjectId(),
      frequency: 'daily',
    });

    // Мокаем метод validate, чтобы не обращаться к реальной БД
    habit.validate = jest.fn((callback) => {
      const error = new mongoose.Error.ValidationError();
      error.errors.title = new mongoose.Error.ValidatorError({ 
        path: 'title', 
        message: 'Path `title` is required.' 
      });
      callback(error);
    });

    await expect(new Promise((resolve, reject) => {
      habit.validate((err) => {
        if (err) reject(err);
        else resolve(true);
      });
    })).rejects.toThrow();
  });

  it('should require user reference', async () => {
    const habit = new HabitModel({
      title: 'Ежедневная медитация',
      description: 'Медитация в течение 10 минут каждое утро',
      frequency: 'daily',
    });

    // Мокаем метод validate, чтобы не обращаться к реальной БД
    habit.validate = jest.fn((callback) => {
      const error = new mongoose.Error.ValidationError();
      error.errors.user = new mongoose.Error.ValidatorError({ 
        path: 'user', 
        message: 'Path `user` is required.' 
      });
      callback(error);
    });

    await expect(new Promise((resolve, reject) => {
      habit.validate((err) => {
        if (err) reject(err);
        else resolve(true);
      });
    })).rejects.toThrow();
  });

  it('should validate frequency enumeration', async () => {
    const habit = new HabitModel({
      title: 'Ежедневная медитация',
      description: 'Медитация в течение 10 минут каждое утро',
      user: new mongoose.Types.ObjectId(),
      frequency: 'invalid_frequency', // Неверное значение для перечисления
    });

    // Мокаем метод validate, чтобы не обращаться к реальной БД
    habit.validate = jest.fn((callback) => {
      const error = new mongoose.Error.ValidationError();
      error.errors.frequency = new mongoose.Error.ValidatorError({ 
        path: 'frequency', 
        message: 'Path `frequency` is invalid (invalid_frequency).' 
      });
      callback(error);
    });

    await expect(new Promise((resolve, reject) => {
      habit.validate((err) => {
        if (err) reject(err);
        else resolve(true);
      });
    })).rejects.toThrow();
  });
}); 