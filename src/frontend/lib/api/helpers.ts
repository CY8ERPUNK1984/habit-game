/**
 * Функция для выполнения запросов с прикреплением токена аутентификации
 * из локального хранилища (если доступно)
 */
export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  // Базовые настройки запроса
  const requestOptions: RequestInit = {
    ...options,
    headers: {
      ...options.headers,
    },
  };

  // Добавляем токен авторизации из localStorage, если он есть
  // и мы находимся в браузере
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      requestOptions.headers = {
        ...requestOptions.headers,
        'Authorization': `Bearer ${token}`,
      };
    }
  }

  // Выполняем запрос
  return fetch(url, requestOptions);
}; 