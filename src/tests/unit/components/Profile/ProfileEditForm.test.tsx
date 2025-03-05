import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfileEditForm from '@/frontend/components/Profile/ProfileEditForm';

describe('ProfileEditForm', () => {
  let mockOnSubmit: jest.Mock;
  const userData = {
    id: 'user123',
    name: 'Test User',
    email: 'test@example.com', 
    level: 1,
    experience: 100,
    avatar: 'test-avatar.png'
  };

  beforeEach(() => {
    mockOnSubmit = jest.fn();
  });

  it('должен отображать форму редактирования профиля с предзаполненными данными', () => {
    render(<ProfileEditForm user={userData} onSubmit={mockOnSubmit} />);
    
    // Проверяем наличие всех полей формы и их предзаполненных значений
    expect(screen.getByLabelText('Имя')).toHaveValue('Test User');
    expect(screen.getByLabelText('Email')).toHaveValue('test@example.com');
    expect(screen.getByLabelText('Email')).toBeDisabled(); // Email не должен быть изменяемым
    expect(screen.getByLabelText('URL аватара')).toHaveValue('test-avatar.png');
    expect(screen.getByRole('button', { name: 'Сохранить изменения' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Отмена' })).toBeInTheDocument();
  });
  
  it('должен вызывать onSubmit с обновленными данными при отправке формы', async () => {
    render(<ProfileEditForm user={userData} onSubmit={mockOnSubmit} />);
    
    // Изменяем значения полей
    fireEvent.change(screen.getByLabelText('Имя'), {
      target: { value: 'Updated Name' }
    });
    
    fireEvent.change(screen.getByLabelText('URL аватара'), {
      target: { value: 'new-avatar.png' }
    });
    
    // Отправляем форму
    fireEvent.click(screen.getByRole('button', { name: 'Сохранить изменения' }));
    
    // Проверяем, что onSubmit был вызван с правильными параметрами
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Updated Name',
        avatar: 'new-avatar.png'
      });
    });
  });
  
  it('должен проверять данные перед отправкой', async () => {
    render(<ProfileEditForm user={userData} onSubmit={mockOnSubmit} />);
    
    // Устанавливаем пустое имя (недопустимо)
    fireEvent.change(screen.getByLabelText('Имя'), {
      target: { value: '' }
    });
    
    // Пытаемся отправить форму
    fireEvent.click(screen.getByRole('button', { name: 'Сохранить изменения' }));
    
    // Проверяем, что onSubmit не был вызван
    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
    
    // Проверяем, что появилось сообщение об ошибке
    expect(screen.getByText('Имя не может быть пустым')).toBeInTheDocument();
  });
  
  it('должен отменять изменения по нажатию кнопки отмены', () => {
    const mockOnCancel = jest.fn();
    
    render(
      <ProfileEditForm 
        user={userData} 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel} 
      />
    );
    
    // Нажимаем кнопку отмены
    fireEvent.click(screen.getByRole('button', { name: 'Отмена' }));
    
    // Проверяем, что был вызван коллбэк onCancel
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
}); 