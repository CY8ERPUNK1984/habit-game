import { Request, Response } from 'express';
import { ProfileController } from '../../../backend/controllers/profile.controller';
import { UserService } from '../../../backend/services/user.service';

// Мок для UserService
jest.mock('../../../backend/services/user.service');

describe('Profile Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let profileController: ProfileController;
  
  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
      headers: {},
      user: { id: 'user123' } // Имитация авторизованного пользователя
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    // Сброс моков перед каждым тестом
    jest.clearAllMocks();
    
    // Создаем экземпляр контроллера
    profileController = new ProfileController();
  });
  
  describe('getProfile', () => {
    it('должен успешно получить профиль пользователя', async () => {
      // Подготовка данных
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        level: 1,
        experience: 0,
        avatar: 'default-avatar.png'
      };
      
      // Мокаем метод getUserById
      (UserService.getUserById as jest.Mock).mockResolvedValueOnce(mockUser);
      
      // Вызов метода контроллера
      await profileController.getProfile(mockRequest as Request, mockResponse as Response);
      
      // Проверки
      expect(UserService.getUserById).toHaveBeenCalledWith('user123');
      
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        user: mockUser
      });
    });
    
    it('должен обработать ошибку, если пользователь не найден', async () => {
      // Мокаем метод getUserById для выброса ошибки
      (UserService.getUserById as jest.Mock).mockRejectedValueOnce(new Error('Пользователь не найден'));
      
      // Вызов метода контроллера
      await profileController.getProfile(mockRequest as Request, mockResponse as Response);
      
      // Проверки
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Пользователь не найден'
      });
    });
  });
  
  describe('updateProfile', () => {
    it('должен успешно обновить профиль пользователя', async () => {
      // Подготовка данных
      mockRequest.body = {
        name: 'Updated Name',
        avatar: 'new-avatar.png'
      };
      
      const updatedUser = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Updated Name',
        level: 1,
        experience: 0,
        avatar: 'new-avatar.png'
      };
      
      // Мокаем метод updateUserProfile
      (UserService.updateUserProfile as jest.Mock).mockResolvedValueOnce(updatedUser);
      
      // Вызов метода контроллера
      await profileController.updateProfile(mockRequest as Request, mockResponse as Response);
      
      // Проверки
      expect(UserService.updateUserProfile).toHaveBeenCalledWith(
        'user123',
        { name: 'Updated Name', avatar: 'new-avatar.png' }
      );
      
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Профиль успешно обновлен',
        user: updatedUser
      });
    });
    
    it('должен обработать ошибку, если обновление не удалось', async () => {
      // Подготовка данных
      mockRequest.body = {
        name: 'Updated Name'
      };
      
      // Мокаем метод updateUserProfile для выброса ошибки
      const errorMessage = 'Ошибка при обновлении профиля';
      (UserService.updateUserProfile as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
      
      // Вызов метода контроллера
      await profileController.updateProfile(mockRequest as Request, mockResponse as Response);
      
      // Проверки
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
    
    it('должен обработать запрос с неверными данными', async () => {
      // Подготовка данных - пустое тело запроса
      mockRequest.body = {};
      
      // Вызов метода контроллера
      await profileController.updateProfile(mockRequest as Request, mockResponse as Response);
      
      // Проверки
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Не указаны данные для обновления'
      });
      
      // Проверка, что сервис не вызывался
      expect(UserService.updateUserProfile).not.toHaveBeenCalled();
    });
  });
}); 