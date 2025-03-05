import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegisterForm from '@/frontend/components/Auth/RegisterForm';

// Мокаем next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('RegisterForm', () => {
  let mockOnRegister: jest.Mock;

  beforeEach(() => {
    mockOnRegister = jest.fn();
  });

  it('должен отображать форму регистрации', () => {
    render(<RegisterForm onRegister={mockOnRegister} />);
    
    // Проверяем наличие всех полей формы
    expect(screen.getByTestId('name-input')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-password-input')).toBeInTheDocument();
    expect(screen.getByTestId('register-button')).toBeInTheDocument();
  });
  
  it('должен выводить ошибку, если не все поля заполнены', async () => {
    render(<RegisterForm onRegister={mockOnRegister} />);
    
    // Заполняем только имя, оставляя остальные поля пустыми
    fireEvent.change(screen.getByTestId('name-input'), {
      target: { value: 'Тест Тестович' },
    });
    
    // Отправляем форму
    fireEvent.click(screen.getByTestId('register-button'));
    
    // Проверяем, что onRegister не был вызван
    await waitFor(() => {
      expect(mockOnRegister).not.toHaveBeenCalled();
    });
  });
  
  it('должен выводить ошибку, если пароли не совпадают', async () => {
    render(<RegisterForm onRegister={mockOnRegister} />);
    
    // Заполняем поля с разными паролями
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
    
    // Проверяем, что onRegister не был вызван
    await waitFor(() => {
      expect(mockOnRegister).not.toHaveBeenCalled();
    });
  });
  
  it('должен выводить ошибку, если пароль слишком короткий', async () => {
    render(<RegisterForm onRegister={mockOnRegister} />);
    
    // Заполняем поля с коротким паролем
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
    
    // Проверяем, что onRegister не был вызван
    await waitFor(() => {
      expect(mockOnRegister).not.toHaveBeenCalled();
    });
  });
  
  it('должен выводить ошибку, если email некорректен', async () => {
    render(<RegisterForm onRegister={mockOnRegister} />);
    
    // Заполняем поля с некорректным email
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
    
    // Проверяем, что onRegister не был вызван
    await waitFor(() => {
      expect(mockOnRegister).not.toHaveBeenCalled();
    });
  });
  
  it('должен вызывать onRegister с правильными параметрами при успешном заполнении', async () => {
    render(<RegisterForm onRegister={mockOnRegister} />);
    
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
    
    // Проверяем, что onRegister был вызван с правильными параметрами
    await waitFor(() => {
      expect(mockOnRegister).toHaveBeenCalledTimes(1);
      expect(mockOnRegister).toHaveBeenCalledWith(testName, testEmail, testPassword);
    });
  });
  
  it('должен отображать ошибку, если onRegister выбросил исключение', async () => {
    const errorMessage = 'Ошибка при регистрации';
    mockOnRegister.mockRejectedValueOnce(new Error(errorMessage));
    
    render(<RegisterForm onRegister={mockOnRegister} />);
    
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