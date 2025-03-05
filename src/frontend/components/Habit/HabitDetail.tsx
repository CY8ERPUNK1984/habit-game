'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { HabitCategory, HabitFrequency, HabitPriority } from '../../../backend/models/Habit.model';

interface Habit {
  _id: string;
  title: string;
  description: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  priority: HabitPriority;
  completedToday: boolean;
  streak: number;
  createdAt: string;
  completionHistory: Array<{
    date: string;
    completed: boolean;
  }>;
}

interface HabitDetailProps {
  habitId: string;
}

const HabitDetail = ({ habitId }: HabitDetailProps) => {
  const [habit, setHabit] = useState<Habit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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

  const handleCompleteHabit = async () => {
    if (!habit) return;
    
    try {
      const response = await fetch(`/api/habits/${habitId}/complete`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Не удалось отметить привычку выполненной');
      }

      const data = await response.json();
      setHabit(data.habit);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Произошла ошибка при отметке привычки');
      console.error('Ошибка при отметке привычки:', err);
    }
  };

  const handleDeleteHabit = async () => {
    if (!confirm('Вы уверены, что хотите удалить эту привычку?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/habits/${habitId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Не удалось удалить привычку');
      }

      alert('Привычка успешно удалена');
      router.push('/habits');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Произошла ошибка при удалении привычки');
      console.error('Ошибка при удалении привычки:', err);
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
        <Link href="/habits" className="text-indigo-600 hover:underline mt-2 inline-block">
          Вернуться к списку привычек
        </Link>
      </div>
    );
  }

  if (!habit) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <p>Привычка не найдена</p>
        <Link href="/habits" className="text-indigo-600 hover:underline mt-2 inline-block">
          Вернуться к списку привычек
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{habit.title}</h1>
        <span className="px-3 py-1 bg-gray-100 text-sm font-medium rounded-full text-gray-800">
          {habit.category}
        </span>
      </div>
      
      <div className="mb-6">
        <p className="text-gray-700 mb-4">{habit.description}</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Частота:</p>
            <p className="font-medium">{habit.frequency}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Приоритет:</p>
            <p className="font-medium">{habit.priority}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Серия:</p>
            <p className="font-medium">{habit.streak} дней</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Создана:</p>
            <p className="font-medium">{new Date(habit.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={handleCompleteHabit}
          disabled={habit.completedToday}
          className={`px-4 py-2 rounded-md ${
            habit.completedToday
              ? 'bg-green-100 text-green-700 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {habit.completedToday ? 'Выполнено сегодня ✓' : 'Отметить выполненной'}
        </button>
        
        <Link 
          href={`/habits/${habitId}/edit`}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          Редактировать
        </Link>
        
        <button
          onClick={handleDeleteHabit}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Удалить
        </button>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">История выполнения</h2>
        {habit.completionHistory && habit.completionHistory.length > 0 ? (
          <div className="bg-gray-50 p-4 rounded-lg">
            <ul className="space-y-2">
              {habit.completionHistory.map((record, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{new Date(record.date).toLocaleDateString()}</span>
                  <span className={record.completed ? 'text-green-600' : 'text-red-600'}>
                    {record.completed ? '✓ Выполнено' : '✗ Пропущено'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-500">История выполнения пока отсутствует</p>
        )}
      </div>
    </div>
  );
};

export default HabitDetail; 