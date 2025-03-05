'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Habit {
  _id: string;
  title: string;
  category: string;
  frequency: string;
  completedToday: boolean;
  streak: number;
}

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const response = await fetch('/api/habits');
        
        if (!response.ok) {
          throw new Error('Не удалось загрузить привычки');
        }
        
        const data = await response.json();
        setHabits(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке привычек');
        console.error('Ошибка при загрузке привычек:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHabits();
  }, []);

  const handleCompleteHabit = async (habitId: string) => {
    try {
      const response = await fetch(`/api/habits/${habitId}/complete`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Не удалось отметить привычку выполненной');
      }

      // Обновляем список привычек после отметки
      setHabits(prevHabits => 
        prevHabits.map(habit => 
          habit._id === habitId 
            ? { ...habit, completedToday: true, streak: habit.streak + 1 } 
            : habit
        )
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Произошла ошибка при отметке привычки');
      console.error('Ошибка при отметке привычки:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Мои привычки</h1>
        <Link 
          href="/habits/create" 
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Создать привычку
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      ) : habits.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-700 mb-2">У вас пока нет привычек</h3>
          <p className="text-gray-500 mb-4">Создайте свою первую привычку, чтобы начать путь к лучшей версии себя!</p>
          <Link 
            href="/habits/create" 
            className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Создать первую привычку
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.map((habit) => (
            <div 
              key={habit._id} 
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{habit.title}</h3>
                <span className="px-2 py-1 bg-gray-100 text-xs font-medium rounded-full text-gray-800">
                  {habit.category}
                </span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div>
                  <p className="text-sm text-gray-500">Частота: {habit.frequency}</p>
                  <p className="text-sm text-gray-500">Серия: {habit.streak} дней</p>
                </div>
                <button
                  onClick={() => handleCompleteHabit(habit._id)}
                  disabled={habit.completedToday}
                  className={`px-4 py-2 rounded-md ${
                    habit.completedToday
                      ? 'bg-green-100 text-green-700 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {habit.completedToday ? 'Выполнено ✓' : 'Выполнить'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 