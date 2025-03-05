'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/frontend/contexts/AuthContext';
import Link from 'next/link';

const ProfilePage: React.FC = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  // Перенаправление на страницу входа, если пользователь не аутентифицирован
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  // Если данные загружаются, показываем индикатор загрузки
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  // Если пользователь не аутентифицирован, не показываем содержимое
  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Профиль пользователя</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-32 h-32 md:mr-6 mb-4 md:mb-0">
            <img 
              src={user.avatar || '/default-avatar.png'} 
              alt="Аватар пользователя" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          
          <div className="flex-1">
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-gray-600 mb-2">{user.email}</p>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-sm text-gray-500">Уровень</p>
                <p className="text-xl font-semibold">{user.level}</p>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <p className="text-sm text-gray-500">Опыт</p>
                <p className="text-xl font-semibold">{user.experience}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <Link href="/profile/edit">
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Редактировать профиль
            </button>
          </Link>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Статистика</h3>
        <p className="text-gray-600">
          Здесь будет отображаться ваша статистика по мере использования приложения.
        </p>
      </div>
    </div>
  );
};

export default ProfilePage; 