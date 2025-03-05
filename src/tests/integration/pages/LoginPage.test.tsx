import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginPage from '../../../frontend/app/login/page';
import { AuthProvider } from '../../../frontend/contexts/AuthContext';
import * as authApi from '../../../frontend/lib/api/auth';

// Мокаем необходимые модули
jest.mock('../../../frontend/lib/api/auth');
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  }),
  useSearchParams: () => ({
    get: jest.fn()
  })
}));
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

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

describe('LoginPage Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('должен успешно авторизовать пользователя и перенаправить на дашборд', async () => {
    // Мокаем успешный вход
    const mockUser = {
      id: '123',
      name: 'Test User',
      email: 'test@example.com',
      level: 1,
      experience: 0,
      avatar: null
    };
    (authApi.login as jest.Mock).mockResolvedValue({
      user: mockUser,
      token: 'test-token'
    });
    
    // Мокаем перенаправление
    const mockPush = jest.fn();
    jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue({
      push: mockPush
    });

    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    // Заполняем форму входа
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText('Пароль'), {
      target: { value: 'password123' }
    });

    // Отправляем форму
    fireEvent.click(screen.getByRole('button', { name: 'Войти' }));

    // Проверяем, что во время авторизации отображается индикатор загрузки
    expect(screen.getByText('Вход...')).toBeInTheDocument();

    // Проверяем, что был вызван API с правильными параметрами
    expect(authApi.login).toHaveBeenCalledWith('test@example.com', 'password123');

    // Проверяем, что после успешного входа сохраняется токен
    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith('habit_game_token', 'test-token');
    });

    // Проверяем, что произошло перенаправление на дашборд
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('должен отображать сообщение об ошибке при неудачной авторизации', async () => {
    // Мокаем неудачный вход
    const errorMessage = 'Неверный email или пароль';
    (authApi.login as jest.Mock).mockRejectedValue(new Error(errorMessage));

    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    // Заполняем форму входа
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'wrong@example.com' }
    });
    fireEvent.change(screen.getByLabelText('Пароль'), {
      target: { value: 'wrong-password' }
    });

    // Отправляем форму
    fireEvent.click(screen.getByRole('button', { name: 'Войти' }));

    // Проверяем, что API был вызван с введенными данными
    expect(authApi.login).toHaveBeenCalledWith('wrong@example.com', 'wrong-password');

    // Проверяем, что отображается сообщение об ошибке
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    // Проверяем, что токен не сохранился
    expect(localStorage.setItem).not.toHaveBeenCalledWith('habit_game_token', expect.any(String));
  });

  it('должен отображать сообщение об успешной регистрации, если параметр запроса указывает на это', async () => {
    // Мокаем параметр запроса registered=true
    jest.spyOn(require('next/navigation'), 'useSearchParams').mockReturnValue({
      get: jest.fn().mockImplementation(param => {
        if (param === 'registered') return 'true';
        return null;
      })
    });

    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    // Проверяем, что отображается сообщение об успешной регистрации
    expect(screen.getByText('Регистрация успешна! Теперь вы можете войти в свой аккаунт.')).toBeInTheDocument();
  });

  it('должен перенаправлять авторизованного пользователя на дашборд', async () => {
    // Настраиваем начальное состояние - пользователь уже авторизован
    localStorage.setItem('habit_game_token', 'valid-token');
    
    const mockUser = {
      id: '123',
      name: 'Test User',
      email: 'test@example.com',
      level: 1,
      experience: 0,
      avatar: null
    };
    (authApi.getMe as jest.Mock).mockResolvedValue(mockUser);
    
    // Мокаем функцию перенаправления
    const mockPush = jest.fn();
    jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue({
      push: mockPush
    });

    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    // Проверяем, что произошло перенаправление на дашборд
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('должен иметь рабочую ссылку на страницу регистрации', () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    // Проверяем, что ссылка на регистрацию указывает на правильный путь
    const registerLink = screen.getByText('Зарегистрироваться');
    expect(registerLink).toHaveAttribute('href', '/register');
  });
}); 