import { API_URL } from '../config';

// Интерфейс для статистики пользователя
export interface UserStats {
  totalHabits: number;
  completedCount: number;
  longestStreak: number;
}

/**
 * Получение статистики пользователя
 */
export async function getUserStats(token: string): Promise<UserStats> {
  const response = await fetch(`${API_URL}/stats`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Ошибка при получении статистики');
  }

  const data = await response.json();
  return data.stats;
} 