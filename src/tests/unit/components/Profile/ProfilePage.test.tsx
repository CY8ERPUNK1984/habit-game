import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfilePage from '@/frontend/app/profile/page';

// Мокаем необходимые модули
jest.mock('@/frontend/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 'user123',
      name: 'Test User',
      email: 'test@example.com',
      level: 1,
      experience: 100,
      avatar: 'test-avatar.png'
    },
    isAuthenticated: true,
    loading: false
  })
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}));

describe('ProfilePage Component', () => {
  it('должен отрендерить страницу профиля с данными пользователя', () => {
    render(<ProfilePage />);
    
    // Проверяем, что все основные элементы страницы присутствуют
    expect(screen.getByText('Профиль пользователя')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText(/Уровень: 1/)).toBeInTheDocument();
    expect(screen.getByText(/Опыт: 100/)).toBeInTheDocument();
    expect(screen.getByAltText('Аватар Test User')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Редактировать профиль' })).toBeInTheDocument();
  });
  
  it('должен перенаправить неавторизованного пользователя на страницу входа', async () => {
    // Переопределяем мок для неавторизованного пользователя
    jest.spyOn(require('@/frontend/contexts/AuthContext'), 'useAuth').mockReturnValue({
      user: null,
      isAuthenticated: false,
      loading: false
    });
    
    const mockPush = jest.fn();
    jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue({
      push: mockPush
    });
    
    render(<ProfilePage />);
    
    // Проверяем перенаправление
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });
  
  it('должен отображать индикатор загрузки', () => {
    // Переопределяем мок для состояния загрузки
    jest.spyOn(require('@/frontend/contexts/AuthContext'), 'useAuth').mockReturnValue({
      user: null,
      isAuthenticated: true,
      loading: true
    });
    
    render(<ProfilePage />);
    
    // Проверяем наличие индикатора загрузки
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });
}); 