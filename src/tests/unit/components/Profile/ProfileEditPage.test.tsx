import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useAuth } from '@/frontend/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ProfileEditPage from '@/frontend/app/profile/edit/page';
import * as api from '@/frontend/lib/api/profile';

// Мокаем хуки и API
jest.mock('@/frontend/contexts/AuthContext');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));
jest.mock('@/frontend/lib/api/profile');

describe('ProfileEditPage', () => {
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn()
  };
  
  const userData = {
    id: 'user123',
    name: 'Test User',
    email: 'test@example.com',
    level: 1,
    experience: 100,
    avatar: 'test-avatar.png'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useAuth as jest.Mock).mockReturnValue({
      user: userData,
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
      isAuthenticated: true
    });
  });

  it('должен отображать форму редактирования профиля', () => {
    render(<ProfileEditPage />);
    
    expect(screen.getByText('Редактирование профиля')).toBeInTheDocument();
    expect(screen.getByRole('form')).toBeInTheDocument();
  });

  it('должен перенаправлять на страницу логина, если пользователь не аутентифицирован', () => {
    (useAuth as jest.Mock).mockReturnValueOnce({
      user: null,
      loading: false,
      isAuthenticated: false
    });
    
    render(<ProfileEditPage />);
    
    expect(mockRouter.push).toHaveBeenCalledWith('/login');
  });

  it('должен отображать индикатор загрузки, если данные загружаются', () => {
    (useAuth as jest.Mock).mockReturnValueOnce({
      user: null,
      loading: true,
      isAuthenticated: false
    });
    
    render(<ProfileEditPage />);
    
    expect(screen.getByText('Загрузка...')).toBeInTheDocument();
  });

  it('должен обновлять профиль через API при отправке формы', async () => {
    const mockUpdateProfile = jest.fn().mockResolvedValue({ success: true });
    (api.updateProfile as jest.Mock).mockImplementation(mockUpdateProfile);
    
    render(<ProfileEditPage />);
    
    // Симулируем успешное обновление профиля, которое вызывается из компонента формы
    const formSubmitCallback = screen.getByRole('form').onsubmit;
    formSubmitCallback({ 
      preventDefault: jest.fn(),
      target: {
        name: { value: 'Updated Name' },
        avatar: { value: 'new-avatar.png' }
      }
    });
    
    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith({
        name: 'Updated Name',
        avatar: 'new-avatar.png'
      });
      expect(mockRouter.back).toHaveBeenCalled();
    });
  });

  it('должен отображать ошибки при неудачном обновлении профиля', async () => {
    const mockUpdateProfile = jest.fn().mockResolvedValue({ 
      success: false, 
      error: 'Ошибка обновления профиля' 
    });
    (api.updateProfile as jest.Mock).mockImplementation(mockUpdateProfile);
    
    render(<ProfileEditPage />);
    
    // Симулируем неудачное обновление профиля
    const formSubmitCallback = screen.getByRole('form').onsubmit;
    formSubmitCallback({ 
      preventDefault: jest.fn(),
      target: {
        name: { value: 'Updated Name' },
        avatar: { value: 'new-avatar.png' }
      }
    });
    
    await waitFor(() => {
      expect(screen.getByText('Ошибка обновления профиля')).toBeInTheDocument();
      expect(mockRouter.back).not.toHaveBeenCalled();
    });
  });
}); 