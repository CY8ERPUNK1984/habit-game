import { fetchWithAuth } from './helpers';

export interface ProfileUpdateData {
  name?: string;
  avatar?: string;
}

export interface ProfileResponse {
  success: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    level: number;
    experience: number;
    avatar: string;
  };
  error?: string;
}

/**
 * Получение профиля пользователя
 */
export const getProfile = async (): Promise<ProfileResponse> => {
  try {
    const response = await fetchWithAuth('/api/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: 'Не удалось получить данные профиля',
    };
  }
};

/**
 * Обновление профиля пользователя
 */
export const updateProfile = async (profileData: ProfileUpdateData): Promise<ProfileResponse> => {
  try {
    const response = await fetchWithAuth('/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: 'Не удалось обновить профиль',
    };
  }
}; 