'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/frontend/contexts/AuthContext';
import { updateProfile } from '@/frontend/lib/api/profile';
import ProfileEditForm from '@/frontend/components/Profile/ProfileEditForm';

const ProfileEditPage: React.FC = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Перенаправление на страницу входа, если пользователь не аутентифицирован
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  // Обработчик отправки формы
  const handleSubmit = async (data: { name: string; avatar: string }) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await updateProfile(data);
      
      if (response.success) {
        // Возвращаемся на страницу профиля после успешного обновления
        router.back();
      } else {
        setError(response.error || 'Ошибка обновления профиля');
      }
    } catch (err) {
      setError('Произошла ошибка при обновлении профиля');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Обработчик отмены
  const handleCancel = () => {
    router.back();
  };

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
      <h1 className="text-3xl font-bold mb-6">Редактирование профиля</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <ProfileEditForm 
          user={user}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default ProfileEditPage; 