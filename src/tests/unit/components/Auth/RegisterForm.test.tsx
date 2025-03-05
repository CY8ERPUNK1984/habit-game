import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegisterForm from '../../../../frontend/components/Auth/RegisterForm';

// Мок для useRouter
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('RegisterForm Component', () => {
  const mockOnSubmit = jest.fn();
  
  beforeEach(() => {
    mockOnSubmit.mockClear();
  });
  
  it('должен отрендерить форму регистрации', () => {
    render(<RegisterForm onSubmit={mockOnSubmit} />);
    
    // Проверяем, что все элементы формы присутствуют
    expect(screen.getByTestId('register-form')).toBeInTheDocument();
    expect(screen.getByTestId('name-input')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-password-input')).toBeInTheDocument();
    expect(screen.getByTestId('register-button')).toBeInTheDocument();
  });
  
  it('должен выводить ошибку, если не все поля заполнены', async () => {
    render(<RegisterForm onSubmit={mockOnSubmit} />);
    
    // Заполняем только часть полей
    fireEvent.change(screen.getByTestId('name-input'), {
      target: { value: 'Тест Тестович' },
    });
    
    // Отправляем форму
    fireEvent.click(screen.getByTestId('register-button'));
    
    // Проверяем, что появилось сообщение об ошибке
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
      expect(screen.getByTestId('error-message')).toHaveTextContent('Все поля обязательны для заполнения');
    });
    
    // Проверяем, что onSubmit не был вызван
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
  
  it('должен выводить ошибку, если пароли не совпадают', async () => {
    render(<RegisterForm onSubmit={mockOnSubmit} />);
    
    // Заполняем все поля, но с разными паролями
    fireEvent.change(screen.getByTestId('name-input'), {
      target: { value: 'Тест Тестович' },
    });
    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByTestId('confirm-password-input'), {
      target: { value: 'password456' },
    });
    
    // Отправляем форму
    fireEvent.click(screen.getByTestId('register-button'));
    
    // Проверяем, что появилось сообщение об ошибке
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
      expect(screen.getByTestId('error-message')).toHaveTextContent('Пароли не совпадают');
    });
    
    // Проверяем, что onSubmit не был вызван
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
  
  it('должен выводить ошибку, если пароль слишком короткий', async () => {
    render(<RegisterForm onSubmit={mockOnSubmit} />);
    
    // Заполняем все поля, но с коротким паролем
    fireEvent.change(screen.getByTestId('name-input'), {
      target: { value: 'Тест Тестович' },
    });
    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: '123' },
    });
    fireEvent.change(screen.getByTestId('confirm-password-input'), {
      target: { value: '123' },
    });
    
    // Отправляем форму
    fireEvent.click(screen.getByTestId('register-button'));
    
    // Проверяем, что появилось сообщение об ошибке
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
      expect(screen.getByTestId('error-message')).toHaveTextContent('Пароль должен содержать не менее 8 символов');
    });
    
    // Проверяем, что onSubmit не был вызван
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
  
  it('должен выводить ошибку, если email некорректен', async () => {
    render(<RegisterForm onSubmit={mockOnSubmit} />);
    
    // Заполняем все поля, но с некорректным email
    fireEvent.change(screen.getByTestId('name-input'), {
      target: { value: 'Тест Тестович' },
    });
    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'invalid-email' },
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByTestId('confirm-password-input'), {
      target: { value: 'password123' },
    });
    
    // Отправляем форму
    fireEvent.click(screen.getByTestId('register-button'));
    
    // Проверяем, что появилось сообщение об ошибке
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
      expect(screen.getByTestId('error-message')).toHaveTextContent('Пожалуйста, введите корректный email');
    });
    
    // Проверяем, что onSubmit не был вызван
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
  
  it('должен вызывать onSubmit с правильными параметрами при успешном заполнении', async () => {
    render(<RegisterForm onSubmit={mockOnSubmit} />);
    
    const testName = 'Тест Тестович';
    const testEmail = 'test@example.com';
    const testPassword = 'password123';
    
    // Заполняем все поля корректно
    fireEvent.change(screen.getByTestId('name-input'), {
      target: { value: testName },
    });
    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: testEmail },
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: testPassword },
    });
    fireEvent.change(screen.getByTestId('confirm-password-input'), {
      target: { value: testPassword },
    });
    
    // Отправляем форму
    fireEvent.click(screen.getByTestId('register-button'));
    
    // Проверяем, что onSubmit был вызван с правильными параметрами
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith(testName, testEmail, testPassword);
    });
  });
  
  it('должен отображать ошибку, если onSubmit выбросил исключение', async () => {
    const errorMessage = 'Ошибка при регистрации';
    mockOnSubmit.mockRejectedValueOnce(new Error(errorMessage));
    
    render(<RegisterForm onSubmit={mockOnSubmit} />);
    
    // Заполняем все поля корректно
    fireEvent.change(screen.getByTestId('name-input'), {
      target: { value: 'Тест Тестович' },
    });
    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByTestId('confirm-password-input'), {
      target: { value: 'password123' },
    });
    
    // Отправляем форму
    fireEvent.click(screen.getByTestId('register-button'));
    
    // Проверяем, что появилось сообщение об ошибке
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
      expect(screen.getByTestId('error-message')).toHaveTextContent(errorMessage);
    });
  });
}); 