'use client';

import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Если пользователь не аутентифицирован и загрузка завершена, перенаправляем на страницу входа
    if (!isAuthenticated && !loading) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // Отображаем загрузку, пока проверяем аутентификацию
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Добро пожаловать, {user.name}!</h1>
        <p className="text-gray-600 mt-2">Это ваша личная панель управления привычками и целями.</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <div className="mr-4">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={`Аватар ${user.name}`} 
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 text-xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div>
            <h2 className="font-semibold text-lg">{user.name}</h2>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <div className="flex items-center mt-1">
              <span className="text-sm font-medium">Уровень: {user.level}</span>
              <span className="mx-2 text-gray-300">|</span>
              <span className="text-sm font-medium">Опыт: {user.experience} XP</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Мои привычки</h2>
          <p className="text-gray-600">У вас пока нет добавленных привычек.</p>
          <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
            Добавить привычку
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Мои достижения</h2>
          <p className="text-gray-600">Вы пока не получили ни одного достижения.</p>
          <button className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded">
            Посмотреть все достижения
          </button>
        </div>
      </div>
    </div>
  );
} 