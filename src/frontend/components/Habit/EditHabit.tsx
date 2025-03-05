'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HabitForm, { HabitFormData } from './HabitForm';
import { HabitCategory, HabitFrequency, HabitPriority } from '../../../backend/models/Habit.model';

interface EditHabitProps {
  habitId: string;
}

interface Habit {
  _id: string;
  title: string;
  description: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  priority: HabitPriority;
  targetEndDate?: string;
}

const EditHabit = ({ habitId }: EditHabitProps) => {
  const [habit, setHabit] = useState<Habit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchHabit = async () => {
      try {
        const response = await fetch(`/api/habits/${habitId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Привычка не найдена');
          }
          throw new Error('Не удалось загрузить данные привычки');
        }
        
        const data = await response.json();
        setHabit(data.habit);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке привычки');
        console.error('Ошибка при загрузке привычки:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (habitId) {
      fetchHabit();
    }
  }, [habitId]);

  const handleSubmit = async (data: HabitFormData) => {
    setIsSaving(true);

    try {
      const response = await fetch(`/api/habits/${habitId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Не удалось обновить привычку');
      }

      // Получаем обновленную привычку
      await response.json();
      alert('Привычка успешно обновлена!');
      router.push(`/habits/${habitId}`); // Перенаправление на страницу с деталями привычки
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Произошла ошибка при обновлении привычки');
      }
      console.error('Ошибка при обновлении привычки:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
        <button 
          onClick={() => router.push('/habits')}
          className="text-indigo-600 hover:underline mt-2"
        >
          Вернуться к списку привычек
        </button>
      </div>
    );
  }

  if (!habit) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <p>Привычка не найдена</p>
        <button 
          onClick={() => router.push('/habits')}
          className="text-indigo-600 hover:underline mt-2"
        >
          Вернуться к списку привычек
        </button>
      </div>
    );
  }

  const initialData: HabitFormData = {
    title: habit.title,
    description: habit.description || '',
    frequency: habit.frequency,
    category: habit.category,
    priority: habit.priority,
    targetEndDate: habit.targetEndDate ? new Date(habit.targetEndDate) : undefined,
  };

  return (
    <div className="max-w-2xl mx-auto my-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Редактирование привычки</h1>
      <p className="mb-4 text-gray-600">
        Измените данные привычки в форме ниже.
      </p>
      <HabitForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isLoading={isSaving}
        mode="edit"
      />
    </div>
  );
};

export default EditHabit; 