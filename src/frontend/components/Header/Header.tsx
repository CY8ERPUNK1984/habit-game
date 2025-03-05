import React from 'react';
import Link from 'next/link';

interface HeaderProps {
  username?: string;
}

const Header: React.FC<HeaderProps> = ({ username }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          Геймификация жизни
        </Link>
        
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/habits" className="hover:text-blue-600 transition-colors">
                Привычки
              </Link>
            </li>
            <li>
              <Link href="/tasks" className="hover:text-blue-600 transition-colors">
                Задачи
              </Link>
            </li>
            <li>
              <Link href="/achievements" className="hover:text-blue-600 transition-colors">
                Достижения
              </Link>
            </li>
          </ul>
        </nav>
        
        <div>
          {username ? (
            <Link href="/profile" className="hover:text-blue-600 transition-colors">
              {username}
            </Link>
          ) : (
            <Link href="/login" className="btn-primary">
              Войти
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 