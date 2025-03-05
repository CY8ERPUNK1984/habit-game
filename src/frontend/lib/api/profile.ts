import { API_URL } from '../config';
import { UserData } from './auth';

// Типы запросов
export interface UpdateProfileData {
  name?: string;
  avatar?: string;
}

// Функция для получения профиля пользователя
export async function getProfile(token: string): Promise<UserData> {
  const response = await fetch(`${API_URL}/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Ошибка при получении профиля');
  }

  const data = await response.json();
  return data.user;
}

// Функция для обновления профиля пользователя
export async function updateProfile(token: string, data: UpdateProfileData): Promise<UserData> {
  const response = await fetch(`${API_URL}/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Ошибка при обновлении профиля');
  }

  const responseData = await response.json();
  return responseData.user;
} 