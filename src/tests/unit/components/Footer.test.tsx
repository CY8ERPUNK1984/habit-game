import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../../../frontend/components/Footer';

describe('Footer Component', () => {
  it('renders correctly', () => {
    render(<Footer />);
    
    // Проверяем наличие текущего года в футере
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`${currentYear}\\s+Геймификация жизни`))).toBeInTheDocument();
    
    // Проверяем наличие ссылок
    expect(screen.getByText('О проекте')).toBeInTheDocument();
    expect(screen.getByText('Конфиденциальность')).toBeInTheDocument();
    expect(screen.getByText('Условия')).toBeInTheDocument();
    
    // Проверяем, что текст о правах присутствует
    expect(screen.getByText(/Все права защищены/i)).toBeInTheDocument();
  });
}); 