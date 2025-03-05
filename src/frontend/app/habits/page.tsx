'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import ExperienceBar from '../../components/User/ExperienceBar';
import LevelUpEffect from '../../components/Effects/LevelUpEffect';

interface Habit {
  _id: string;
  title: string;
  category: string;
  frequency: string;
  completedToday: boolean;
  streak: number;
}

interface UserProfile {
  id: string;
  name: string;
  level: number;
  experience: number;
}

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(1);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/profile');
        if (!response.ok) {
          throw new Error('Не удалось загрузить профиль пользователя');
        }
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error('Ошибка при загрузке профиля пользователя:', error);
      }
    };

    const fetchHabits = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/habits');
        if (!response.ok) {
          throw new Error('Не удалось загрузить привычки');
        }
        const data = await response.json();
        setHabits(data.habits);
      } catch (error) {
        setError('Произошла ошибка при загрузке привычек');
        console.error('Ошибка при загрузке привычек:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
    fetchHabits();
  }, []);

  const handleCompleteHabit = async (habitId: string) => {
    try {
      const response = await fetch(`/api/habits/${habitId}/complete`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Не удалось отметить привычку как выполненную');
      }

      const data = await response.json();

      // Обновляем список привычек
      setHabits(habits.map(habit => {
        if (habit._id === habitId) {
          return {
            ...habit,
            completedToday: true,
            streak: habit.streak + 1
          };
        }
        return habit;
      }));

      // Обновляем уровень и опыт пользователя
      if (user && data.userLevel && data.userExperience) {
        // Проверяем, произошло ли повышение уровня
        if (data.levelUp || data.userLevel > user.level) {
          setNewLevel(data.userLevel);
          setShowLevelUp(true);
        }
        
        // Обновляем данные пользователя
        setUser({
          ...user,
          level: data.userLevel,
          experience: data.userExperience
        });
      }

    } catch (error) {
      alert('Произошла ошибка при отметке привычки');
      console.error('Ошибка при отметке привычки:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Показываем эффект повышения уровня, если произошло повышение */}
      {showLevelUp && (
        <LevelUpEffect 
          level={newLevel} 
          show={showLevelUp} 
          onClose={() => setShowLevelUp(false)} 
        />
      )}

      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Мои привычки</h1>
        
        {/* Отображаем информацию о уровне и опыте пользователя */}
        {user && (
          <div className="w-full md:w-1/2">
            <ExperienceBar 
              level={user.level} 
              experience={user.experience} 
              className="mb-4"
            />
          </div>
        )}
        
        <Link 
          href="/habits/create" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
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
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-8 rounded text-center">
          <p className="text-lg mb-4">У вас пока нет привычек</p>
          <Link 
            href="/habits/create" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          >
            Создать первую привычку
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.map((habit) => (
            <div key={habit._id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{habit.title}</h2>
                  <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(habit.category)}`}>
                    {getCategoryLabel(habit.category)}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">Частота: {getFrequencyLabel(habit.frequency)}</p>
                <p className="text-gray-600 mb-4">Серия: {habit.streak} дней</p>
                
                <div className="flex justify-between items-center">
                  <div>
                    <button
                      onClick={() => handleCompleteHabit(habit._id)}
                      disabled={habit.completedToday}
                      className={`mr-2 ${
                        habit.completedToday
                          ? 'bg-green-100 text-green-800 cursor-not-allowed'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      } font-bold py-1 px-3 rounded text-sm`}
                    >
                      {habit.completedToday ? 'Выполнено' : 'Отметить'}
                    </button>
                    <Link
                      href={`/habits/${habit._id}`}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded text-sm mr-2"
                    >
                      Детали
                    </Link>
                    <Link
                      href={`/habits/${habit._id}/edit`}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded text-sm"
                    >
                      Изменить
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Вспомогательные функции для отображения меток
function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    'health': 'Здоровье',
    'productivity': 'Продуктивность',
    'education': 'Образование',
    'social': 'Социальные',
    'mindfulness': 'Осознанность',
    'career': 'Карьера',
    'finance': 'Финансы',
    'other': 'Другое'
  };
  return labels[category] || category;
}

function getFrequencyLabel(frequency: string): string {
  const labels: Record<string, string> = {
    'daily': 'Ежедневно',
    'weekly': 'Еженедельно',
    'monthly': 'Ежемесячно',
    'custom': 'Пользовательская'
  };
  return labels[frequency] || frequency;
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'health': 'bg-green-100 text-green-800',
    'productivity': 'bg-blue-100 text-blue-800',
    'education': 'bg-purple-100 text-purple-800',
    'social': 'bg-pink-100 text-pink-800',
    'mindfulness': 'bg-indigo-100 text-indigo-800',
    'career': 'bg-yellow-100 text-yellow-800',
    'finance': 'bg-teal-100 text-teal-800',
    'other': 'bg-gray-100 text-gray-800'
  };
  return colors[category] || 'bg-gray-100 text-gray-800';
} 