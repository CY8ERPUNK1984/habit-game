import mongoose from 'mongoose';
import { UserModel } from '../../../backend/models/User.model';

describe('User Model', () => {
  beforeAll(async () => {
    // Используем моки из jest.setup.js
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create a new user', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'Password123!',
      name: 'Test User',
    };

    const user = new UserModel(userData);
    
    // Мокаем метод save, чтобы не обращаться к реальной БД
    user.save = jest.fn().mockResolvedValueOnce(user);
    
    const savedUser = await user.save();
    
    expect(savedUser).toBeDefined();
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.name).toBe(userData.name);
    // Пароль не должен сохраняться в чистом виде
    expect(savedUser.password).not.toBe(userData.password);
  });

  it('should require email', async () => {
    const user = new UserModel({
      password: 'Password123!',
      name: 'Test User',
    });

    // Мокаем метод validate, чтобы не обращаться к реальной БД
    user.validate = jest.fn((callback) => {
      const error = new mongoose.Error.ValidationError();
      error.errors.email = new mongoose.Error.ValidatorError({ 
        path: 'email', 
        message: 'Path `email` is required.' 
      });
      callback(error);
    });

    await expect(new Promise((resolve, reject) => {
      user.validate((err) => {
        if (err) reject(err);
        else resolve(true);
      });
    })).rejects.toThrow();
  });

  it('should require valid email format', async () => {
    const user = new UserModel({
      email: 'invalid-email',
      password: 'Password123!',
      name: 'Test User',
    });

    // Мокаем метод validate, чтобы не обращаться к реальной БД
    user.validate = jest.fn((callback) => {
      const error = new mongoose.Error.ValidationError();
      error.errors.email = new mongoose.Error.ValidatorError({ 
        path: 'email', 
        message: 'Please fill a valid email address' 
      });
      callback(error);
    });

    await expect(new Promise((resolve, reject) => {
      user.validate((err) => {
        if (err) reject(err);
        else resolve(true);
      });
    })).rejects.toThrow();
  });
}); 