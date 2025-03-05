import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../../../frontend/app/page';

// Мок для next/navigation, который используется в компонентах
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

describe('Home Page Integration', () => {
  it('renders the homepage correctly', () => {
    render(<Home />);
    
    // Проверяем, что заголовок страницы отображается
    expect(screen.getByText('Геймификация жизни')).toBeInTheDocument();
    
    // Проверяем, что подзаголовок отображается
    expect(screen.getByText('Превращайте ваши привычки в игру и достигайте целей')).toBeInTheDocument();
    
    // Проверяем наличие кнопки "Начать"
    expect(screen.getByText('Начать')).toBeInTheDocument();
  });
  
  it('button is clickable', async () => {
    const user = userEvent.setup();
    render(<Home />);
    
    // Находим кнопку "Начать"
    const startButton = screen.getByText('Начать');
    
    // Имитируем клик по кнопке
    await user.click(startButton);
    
    // Здесь мы можем добавить дополнительные проверки
    // Например, если клик должен вызывать какую-то функцию или изменять состояние
  });
}); 