// API URL для разных окружений
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// Ключ для хранения токена в localStorage
export const TOKEN_KEY = 'habit_game_token';

// Срок действия токена в днях
export const TOKEN_EXPIRY_DAYS = 30;

// Настройки по умолчанию для fetch запросов
export const DEFAULT_FETCH_OPTIONS = {
  headers: {
    'Content-Type': 'application/json',
  },
}; 