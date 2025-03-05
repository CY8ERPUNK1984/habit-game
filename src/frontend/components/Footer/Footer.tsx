import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 mt-12 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600">
              &copy; {year} Геймификация жизни. Все права защищены.
            </p>
          </div>
          
          <nav className="flex space-x-4">
            <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
              О проекте
            </Link>
            <Link href="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">
              Конфиденциальность
            </Link>
            <Link href="/terms" className="text-gray-600 hover:text-blue-600 transition-colors">
              Условия
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 