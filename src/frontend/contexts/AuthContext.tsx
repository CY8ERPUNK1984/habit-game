'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import * as authApi from '../lib/api/auth';

interface User {
  id: string;
  name: string;
  email: string;
  level: number;
  experience: number;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Сохранение токена в localStorage
  const saveToken = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('habit_game_token', newToken);
    
    // Установка срока действия токена (30 дней)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    localStorage.setItem('habit_game_token_expiry', expiryDate.toISOString());
  };

  // Загрузка токена из localStorage
  const loadToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    
    const savedToken = localStorage.getItem('habit_game_token');
    const tokenExpiry = localStorage.getItem('habit_game_token_expiry');
    
    if (!savedToken || !tokenExpiry) return null;
    
    // Проверка срока действия токена
    const expiryDate = new Date(tokenExpiry);
    if (expiryDate < new Date()) {
      // Токен истек, удаляем его
      localStorage.removeItem('habit_game_token');
      localStorage.removeItem('habit_game_token_expiry');
      return null;
    }
    
    return savedToken;
  };

  // Загрузка пользователя по токену
  const loadUser = async (authToken: string) => {
    try {
      setLoading(true);
      const userData = await authApi.getMe(authToken);
      setUser(userData);
      setToken(authToken);
      return userData;
    } catch (error) {
      logout();
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Проверка токена при загрузке страницы
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedToken = loadToken();
        
        if (savedToken) {
          await loadUser(savedToken);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Ошибка при загрузке пользователя:', error);
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);

  // Регистрация нового пользователя
  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const { token: newToken, user: newUser } = await authApi.register({ 
        name, 
        email, 
        password 
      });
      
      saveToken(newToken);
      setUser(newUser);
      router.push('/dashboard');
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Вход пользователя
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { token: newToken, user: newUser } = await authApi.login({ 
        email, 
        password 
      });
      
      saveToken(newToken);
      setUser(newUser);
      router.push('/dashboard');
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Выход пользователя
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('habit_game_token');
    localStorage.removeItem('habit_game_token_expiry');
    router.push('/login');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    loading,
    register,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 