'use client';

import { useState, useEffect } from 'react';
import { RegisterForm } from '../../components/Auth/RegisterForm';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Head from 'next/head';

export default function RegisterPage() {
  const { register, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleRegister = async (name: string, email: string, password: string) => {
    setError('');
    setIsRegistering(true);
    try {
      await register(name, email, password);
      // Редирект произойдет автоматически при изменении isAuthenticated
    } catch (err: any) {
      setError(err.message || 'Ошибка при регистрации. Пожалуйста, попробуйте снова.');
    } finally {
      setIsRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Регистрация | Геймификация жизни</title>
        <meta name="description" content="Создайте аккаунт и начните гейфицировать свою жизнь" />
      </Head>
      
      <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6">Регистрация</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        <RegisterForm 
          onRegister={handleRegister} 
          isLoading={isRegistering}
        />
        
        <div className="mt-4 text-center">
          <p>Уже есть аккаунт? <Link href="/login" className="text-blue-600 hover:underline">Войти</Link></p>
        </div>
      </div>
    </>
  );
} 