import { Request, Response, NextFunction } from 'express';
import { AuthMiddleware } from '../../../backend/middleware/auth.middleware';
import jwt from 'jsonwebtoken';
import { UserModel } from '../../../backend/models/User.model';

// Мок для jwt и UserModel
jest.mock('jsonwebtoken');
jest.mock('../../../backend/models/User.model');

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;
  
  beforeEach(() => {
    mockRequest = {
      headers: {},
      cookies: {}
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    nextFunction = jest.fn();
    
    // Сброс моков перед каждым тестом
    jest.clearAllMocks();
  });
  
  describe('protect', () => {
    it('should call next() if token is valid', async () => {
      // Подготовка данных
      const userId = 'user123';
      mockRequest.cookies = { token: 'valid-token' };
      
      // Мокаем jwt.verify
      (jwt.verify as jest.Mock).mockReturnValueOnce({ id: userId });
      
      // Мокаем UserModel.findById
      (UserModel.findById as jest.Mock).mockResolvedValueOnce({
        id: userId,
        email: 'test@example.com',
        name: 'Test User'
      });
      
      // Вызов middleware
      await AuthMiddleware.protect(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );
      
      // Проверки
      expect(jwt.verify).toHaveBeenCalledWith('valid-token', expect.any(String));
      expect(UserModel.findById).toHaveBeenCalledWith(userId);
      expect(mockRequest.user).toEqual({
        id: userId,
        email: 'test@example.com',
        name: 'Test User'
      });
      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
    
    it('should return 401 if no token provided', async () => {
      // Подготовка данных - нет токена
      mockRequest.cookies = {};
      
      // Вызов middleware
      await AuthMiddleware.protect(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );
      
      // Проверки
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Требуется авторизация'
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });
    
    it('should return 401 if token is invalid', async () => {
      // Подготовка данных
      mockRequest.cookies = { token: 'invalid-token' };
      
      // Мокаем jwt.verify для выброса ошибки
      (jwt.verify as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Недействительный токен');
      });
      
      // Вызов middleware
      await AuthMiddleware.protect(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );
      
      // Проверки
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Недействительный токен, авторизация не удалась'
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });
    
    it('should return 404 if user not found', async () => {
      // Подготовка данных
      const userId = 'nonexistent';
      mockRequest.cookies = { token: 'valid-token' };
      
      // Мокаем jwt.verify
      (jwt.verify as jest.Mock).mockReturnValueOnce({ id: userId });
      
      // Мокаем UserModel.findById - пользователь не найден
      (UserModel.findById as jest.Mock).mockResolvedValueOnce(null);
      
      // Вызов middleware
      await AuthMiddleware.protect(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );
      
      // Проверки
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Пользователь с данным токеном не существует'
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });
}); 