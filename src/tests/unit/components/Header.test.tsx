import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../../../frontend/components/Header';

describe('Header Component', () => {
  it('renders without a username', () => {
    render(<Header />);
    
    // Проверяем, что логотип присутствует
    expect(screen.getByText('Геймификация жизни')).toBeInTheDocument();
    
    // Проверяем навигационные ссылки
    expect(screen.getByText('Привычки')).toBeInTheDocument();
    expect(screen.getByText('Задачи')).toBeInTheDocument();
    expect(screen.getByText('Достижения')).toBeInTheDocument();
    
    // Проверяем кнопку входа
    expect(screen.getByText('Войти')).toBeInTheDocument();
  });

  it('renders with a username', () => {
    const testUsername = 'Тестовый Пользователь';
    render(<Header username={testUsername} />);
    
    // Проверяем, что логотип присутствует
    expect(screen.getByText('Геймификация жизни')).toBeInTheDocument();
    
    // Проверяем, что имя пользователя отображается
    expect(screen.getByText(testUsername)).toBeInTheDocument();
    
    // Проверяем, что кнопка входа отсутствует
    expect(screen.queryByText('Войти')).not.toBeInTheDocument();
  });
});