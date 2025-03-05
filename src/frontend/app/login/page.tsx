'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const { login, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Проверка, был ли пользователь только что зарегистрирован
  useEffect(() => {
    const registered = searchParams.get('registered');
    if (registered === 'true') {
      setShowSuccessMessage(true);
    }
  }, [searchParams]);

  // Перенаправление авторизованного пользователя
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);

    try {
      await login(email, password);
      // Редирект произойдет автоматически при изменении isAuthenticated
    } catch (err: any) {
      setError(err.message || 'Ошибка при входе. Проверьте ваши данные и попробуйте снова.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center mb-6">Вход в аккаунт</h1>
      
      {showSuccessMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
          <p>Регистрация успешна! Теперь вы можете войти в свой аккаунт.</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
            required
            disabled={isLoggingIn}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Пароль
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
            required
            disabled={isLoggingIn}
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-md transition duration-200"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Вход...
              </span>
            ) : (
              'Войти'
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-4 text-center">
        <p>Нет аккаунта? <Link href="/register" className="text-blue-600 hover:underline">Зарегистрироваться</Link></p>
      </div>
    </div>
  );
} 