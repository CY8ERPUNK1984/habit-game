import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginPage from '../../../../frontend/app/login/page';

// Мокаем необходимые модули
jest.mock('../../../../frontend/contexts/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn(),
    isAuthenticated: false,
    loading: false
  })
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  }),
  useSearchParams: () => ({
    get: jest.fn()
  })
}));

// Мокаем Link из next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('LoginPage Component', () => {
  it('должен отрендерить страницу входа', () => {
    render(<LoginPage />);
    
    // Проверяем, что все основные элементы формы присутствуют
    expect(screen.getByText('Вход в аккаунт')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Пароль')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument();
    expect(screen.getByText('Нет аккаунта?')).toBeInTheDocument();
    expect(screen.getByText('Зарегистрироваться')).toBeInTheDocument();
  });
  
  it('должен вызывать функцию login с введенными данными при отправке формы', async () => {
    const mockLogin = jest.fn().mockResolvedValue(undefined);
    
    jest.spyOn(require('../../../../frontend/contexts/AuthContext'), 'useAuth').mockReturnValue({
      login: mockLogin,
      isAuthenticated: false,
      loading: false
    });
    
    render(<LoginPage />);
    
    const testEmail = 'test@example.com';
    const testPassword = 'password123';
    
    // Заполняем форму
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: testEmail }
    });
    
    fireEvent.change(screen.getByLabelText('Пароль'), {
      target: { value: testPassword }
    });
    
    // Отправляем форму
    fireEvent.click(screen.getByRole('button', { name: 'Войти' }));
    
    // Проверяем, что функция login была вызвана с правильными параметрами
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledTimes(1);
      expect(mockLogin).toHaveBeenCalledWith(testEmail, testPassword);
    });
  });
  
  it('должен отображать сообщение об ошибке при неудачной попытке входа', async () => {
    const errorMessage = 'Неверные учетные данные';
    const mockLogin = jest.fn().mockRejectedValue(new Error(errorMessage));
    
    jest.spyOn(require('../../../../frontend/contexts/AuthContext'), 'useAuth').mockReturnValue({
      login: mockLogin,
      isAuthenticated: false,
      loading: false
    });
    
    render(<LoginPage />);
    
    // Заполняем форму
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText('Пароль'), {
      target: { value: 'wrong-password' }
    });
    
    // Отправляем форму
    fireEvent.click(screen.getByRole('button', { name: 'Войти' }));
    
    // Проверяем, что появилось сообщение об ошибке
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
  
  it('должен отображать индикатор загрузки во время процесса входа', async () => {
    // Мокаем функцию login, чтобы она не резолвилась мгновенно
    const mockLogin = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    jest.spyOn(require('../../../../frontend/contexts/AuthContext'), 'useAuth').mockReturnValue({
      login: mockLogin,
      isAuthenticated: false,
      loading: false
    });
    
    render(<LoginPage />);
    
    // Заполняем форму
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText('Пароль'), {
      target: { value: 'password123' }
    });
    
    // Отправляем форму
    fireEvent.click(screen.getByRole('button', { name: 'Войти' }));
    
    // Проверяем, что появился индикатор загрузки
    await waitFor(() => {
      expect(screen.getByText('Вход...')).toBeInTheDocument();
    });
  });
  
  it('должен перенаправлять пользователя на дашборд при успешной авторизации', async () => {
    const mockPush = jest.fn();
    
    jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue({
      push: mockPush
    });
    
    // Мокаем useAuth с флагом isAuthenticated = true
    jest.spyOn(require('../../../../frontend/contexts/AuthContext'), 'useAuth').mockReturnValue({
      login: jest.fn().mockResolvedValue(undefined),
      isAuthenticated: true,
      loading: false
    });
    
    render(<LoginPage />);
    
    // Проверяем, что произошло перенаправление на дашборд
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });
  
  it('должен отображать сообщение об успешной регистрации, если пользователь перешел со страницы регистрации', () => {
    // Мокаем useSearchParams, чтобы он возвращал registered=true
    jest.spyOn(require('next/navigation'), 'useSearchParams').mockReturnValue({
      get: jest.fn().mockImplementation(param => {
        if (param === 'registered') return 'true';
        return null;
      })
    });
    
    render(<LoginPage />);
    
    // Проверяем, что отображается сообщение об успешной регистрации
    expect(screen.getByText('Регистрация успешна! Теперь вы можете войти в свой аккаунт.')).toBeInTheDocument();
  });
  
  it('должен отображать индикатор загрузки, пока происходит проверка аутентификации', () => {
    // Мокаем useAuth с флагом loading = true
    jest.spyOn(require('../../../../frontend/contexts/AuthContext'), 'useAuth').mockReturnValue({
      login: jest.fn(),
      isAuthenticated: false,
      loading: true
    });
    
    render(<LoginPage />);
    
    // Проверяем, что отображается индикатор загрузки (используем querySelector для поиска элемента с классом)
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    
    // И не отображается форма входа
    expect(screen.queryByText('Вход в аккаунт')).not.toBeInTheDocument();
  });
}); 