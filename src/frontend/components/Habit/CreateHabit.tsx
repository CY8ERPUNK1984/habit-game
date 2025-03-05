'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import HabitForm, { HabitFormData } from './HabitForm';

const CreateHabit = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: HabitFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Не удалось создать привычку');
      }

      // Получаем созданную привычку, но не используем пока
      await response.json();
      alert('Привычка успешно создана!');
      router.push('/habits'); // Перенаправление на страницу со списком привычек
      router.refresh(); // Обновление данных на странице
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Произошла ошибка при создании привычки');
      }
      console.error('Ошибка при создании привычки:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Создание новой привычки</h1>
      <p className="mb-4 text-gray-600">
        Заполните форму ниже, чтобы создать новую привычку. Необходимо указать название, частоту и категорию привычки.
      </p>
      <HabitForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        mode="create"
      />
    </div>
  );
};

export default CreateHabit; 