import React from 'react';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from '../../../frontend/contexts/AuthContext';
import * as authApi from '../../../frontend/lib/api/auth';

// Мокаем функции API и localStorage
jest.mock('../../../frontend/lib/api/auth');
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}));

// Мок для localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

// Компонент для тестирования хука useAuth
const TestComponent = () => {
  const { user, isAuthenticated, loading, login, register, logout } = useAuth();
  
  return (
    <div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="authenticated">{isAuthenticated.toString()}</div>
      <div data-testid="user">{user ? JSON.stringify(user) : 'null'}</div>
      <button onClick={() => login('test@example.com', 'password')}>Login</button>
      <button onClick={() => register('Test User', 'test@example.com', 'password')}>Register</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });
  
  it('должен изначально не иметь авторизованного пользователя', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Дожидаемся завершения инициализации
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
    
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    expect(screen.getByTestId('user')).toHaveTextContent('null');
  });
  
  it('должен загружать пользователя из сохраненного токена', async () => {
    // Устанавливаем токен в localStorage
    localStorage.setItem('habit_game_token', 'valid-token');
    localStorage.setItem('habit_game_token_expiry', new Date(Date.now() + 86400000).toISOString()); // Срок действия через 1 день
    
    // Мокаем функцию getMe
    const mockUser = { id: '123', name: 'Test User', email: 'test@example.com', level: 1, experience: 0, avatar: null };
    (authApi.getMe as jest.Mock).mockResolvedValue(mockUser);
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // После загрузки пользователя, должен быть authenticated: true
    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
      expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(mockUser));
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
    
    // Проверяем, что функция getMe была вызвана с токеном
    expect(authApi.getMe).toHaveBeenCalledTimes(1);
    expect(authApi.getMe).toHaveBeenCalledWith('valid-token');
  });
  
  it('должен обрабатывать ошибку получения пользователя из токена', async () => {
    // Устанавливаем токен в localStorage
    localStorage.setItem('habit_game_token', 'invalid-token');
    localStorage.setItem('habit_game_token_expiry', new Date(Date.now() + 86400000).toISOString()); // Срок действия через 1 день
    
    // Мокаем функцию getMe для выброса ошибки
    (authApi.getMe as jest.Mock).mockRejectedValue(new Error('Invalid token'));
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // После неудачной загрузки пользователя, токен должен быть удален
    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
      expect(screen.getByTestId('user')).toHaveTextContent('null');
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
    
    // Проверяем, что localStorage.removeItem был вызван
    expect(localStorage.removeItem).toHaveBeenCalledWith('habit_game_token');
    expect(localStorage.removeItem).toHaveBeenCalledWith('habit_game_token_expiry');
  });
  
  it('должен успешно регистрировать пользователя', async () => {
    // Мокаем функцию register API
    const mockUser = { id: '123', name: 'New User', email: 'new@example.com', level: 1, experience: 0, avatar: null };
    const mockAuthResponse = { user: mockUser, token: 'new-token' };
    (authApi.register as jest.Mock).mockResolvedValue(mockAuthResponse);
    
    // Мокаем useRouter.push
    const mockPush = jest.fn();
    jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue({
      push: mockPush
    });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Дожидаемся завершения инициализации
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
    
    // Нажимаем кнопку Register
    act(() => {
      screen.getByText('Register').click();
    });
    
    // После регистрации, пользователь должен быть авторизован
    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
      expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(mockUser));
      
      // Токен должен быть сохранен в localStorage
      expect(localStorage.setItem).toHaveBeenCalledWith('habit_game_token', 'new-token');
      
      // Должно произойти перенаправление на главную страницу
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });
  
  it('должен успешно авторизовать пользователя', async () => {
    // Мокаем функцию login API
    const mockUser = { id: '123', name: 'Existing User', email: 'existing@example.com', level: 1, experience: 0, avatar: null };
    const mockAuthResponse = { user: mockUser, token: 'login-token' };
    (authApi.login as jest.Mock).mockResolvedValue(mockAuthResponse);
    
    // Мокаем useRouter.push
    const mockPush = jest.fn();
    jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue({
      push: mockPush
    });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Дожидаемся завершения инициализации
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
    
    // Нажимаем кнопку Login
    act(() => {
      screen.getByText('Login').click();
    });
    
    // После входа, пользователь должен быть авторизован
    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
      expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(mockUser));
      
      // Токен должен быть сохранен в localStorage
      expect(localStorage.setItem).toHaveBeenCalledWith('habit_game_token', 'login-token');
      
      // Должно произойти перенаправление на главную страницу
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });
  
  it('должен успешно выполнять выход пользователя', async () => {
    // Устанавливаем начальное состояние - авторизованный пользователь
    localStorage.setItem('habit_game_token', 'valid-token');
    localStorage.setItem('habit_game_token_expiry', new Date(Date.now() + 86400000).toISOString()); // Срок действия через 1 день
    
    const mockUser = { id: '123', name: 'Test User', email: 'test@example.com', level: 1, experience: 0, avatar: null };
    (authApi.getMe as jest.Mock).mockResolvedValue(mockUser);
    
    // Мокаем useRouter.push
    const mockPush = jest.fn();
    jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue({
      push: mockPush
    });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Дожидаемся загрузки пользователя
    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    });
    
    // Нажимаем кнопку Logout
    act(() => {
      screen.getByText('Logout').click();
    });
    
    // После выхода, пользователь должен быть неавторизован
    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
      expect(screen.getByTestId('user')).toHaveTextContent('null');
      
      // Токен должен быть удален из localStorage
      expect(localStorage.removeItem).toHaveBeenCalledWith('habit_game_token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('habit_game_token_expiry');
      
      // Должно произойти перенаправление на страницу входа
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });
}); 