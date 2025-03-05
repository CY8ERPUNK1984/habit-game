import { API_URL } from '../config';

// Типы запросов
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// Типы ответов
export interface UserData {
  id: string;
  name: string;
  email: string;
  level: number;
  experience: number;
  avatar?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token: string;
  user: UserData;
}

// Функция для регистрации пользователя
export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Ошибка при регистрации');
  }

  return await response.json();
}

// Функция для входа пользователя
export async function login(data: LoginData): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Ошибка при входе');
  }

  return await response.json();
}

// Функция для получения данных текущего пользователя
export async function getMe(token: string): Promise<UserData> {
  const response = await fetch(`${API_URL}/auth/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Ошибка при получении данных пользователя');
  }

  const data = await response.json();
  return data.user;
} 