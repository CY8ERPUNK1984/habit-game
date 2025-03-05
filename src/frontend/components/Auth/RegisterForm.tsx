'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface RegisterFormProps {
  onRegister: (name: string, email: string, password: string) => Promise<void>;
  isLoading?: boolean;
}

export default function RegisterForm({ onRegister, isLoading = false }: RegisterFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirm?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  
  const validate = (): boolean => {
    const newErrors: { name?: string; email?: string; password?: string; confirm?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Имя обязательно';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      newErrors.email = 'Некорректный email';
    }
    
    if (!password) {
      newErrors.password = 'Пароль обязателен';
    } else if (password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirm = 'Пароли не совпадают';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    try {
      setIsLoading(true);
      await onRegister(name, email, password);
      router.push('/login?registered=true');
    } catch (error) {
      // Обработка ошибок выполняется на уровне страницы
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Создайте новый аккаунт
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Или{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              войдите в существующий
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} data-testid="register-form">
          {Object.entries(errors).map(([key, value]) => (
            <div key={key} className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800" data-testid={`error-message-${key}`}>
                    {value}
                  </h3>
                </div>
              </div>
            </div>
          ))}
          
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">
                Имя пользователя
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                } rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Имя пользователя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                data-testid="name-input"
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email адрес
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                } focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Email адрес"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="email-input"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                } focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-testid="password-input"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Подтвердите пароль
              </label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.confirm ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                } rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Подтвердите пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                data-testid="confirm-password-input"
              />
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
              disabled={isLoading}
              data-testid="register-button"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Регистрация...
                </span>
              ) : (
                'Зарегистрироваться'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 