import { Request, Response } from 'express';
import { AuthController } from '../../../backend/controllers/auth.controller';
import { UserService } from '../../../backend/services/user.service';

// Мок для UserService
jest.mock('../../../backend/services/user.service');

describe('Auth Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let authController: AuthController;
  
  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
      headers: {}
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn()
    };
    
    // Сброс моков перед каждым тестом
    jest.clearAllMocks();
    
    // Создаем экземпляр контроллера
    authController = new AuthController();
  });
  
  describe('register', () => {
    it('should register a new user successfully', async () => {
      // Подготовка данных
      mockRequest.body = {
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User'
      };
      
      // Мокаем метод createUser
      (UserService.createUser as jest.Mock).mockResolvedValueOnce({
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User'
      });
      
      // Вызов метода контроллера
      await authController.register(mockRequest as Request, mockResponse as Response);
      
      // Проверки
      expect(UserService.createUser).toHaveBeenCalledWith(
        mockRequest.body.email,
        mockRequest.body.password,
        mockRequest.body.name
      );
      
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Пользователь успешно зарегистрирован',
        user: {
          id: 'user123',
          email: 'test@example.com',
          name: 'Test User'
        }
      });
    });
    
    it('should handle registration errors', async () => {
      // Подготовка данных
      mockRequest.body = {
        email: 'existing@example.com',
        password: 'Password123!',
        name: 'Test User'
      };
      
      // Мокаем метод createUser для выброса ошибки
      const errorMessage = 'Пользователь с таким email уже существует';
      (UserService.createUser as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
      
      // Вызов метода контроллера
      await authController.register(mockRequest as Request, mockResponse as Response);
      
      // Проверки
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });
  
  describe('login', () => {
    it('should login user successfully', async () => {
      // Подготовка данных
      mockRequest.body = {
        email: 'test@example.com',
        password: 'Password123!'
      };
      
      // Мокаем метод authenticateUser
      (UserService.authenticateUser as jest.Mock).mockResolvedValueOnce({
        user: {
          id: 'user123',
          email: 'test@example.com',
          name: 'Test User'
        },
        token: 'jwt-token'
      });
      
      // Вызов метода контроллера
      await authController.login(mockRequest as Request, mockResponse as Response);
      
      // Проверки
      expect(UserService.authenticateUser).toHaveBeenCalledWith(
        mockRequest.body.email,
        mockRequest.body.password
      );
      
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'token',
        'jwt-token',
        expect.objectContaining({
          httpOnly: true
        })
      );
      
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Успешная авторизация',
        user: {
          id: 'user123',
          email: 'test@example.com',
          name: 'Test User'
        }
      });
    });
    
    it('should handle login errors', async () => {
      // Подготовка данных
      mockRequest.body = {
        email: 'wrong@example.com',
        password: 'WrongPassword'
      };
      
      // Мокаем метод authenticateUser для выброса ошибки
      const errorMessage = 'Неверные учетные данные';
      (UserService.authenticateUser as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
      
      // Вызов метода контроллера
      await authController.login(mockRequest as Request, mockResponse as Response);
      
      // Проверки
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });
}); 