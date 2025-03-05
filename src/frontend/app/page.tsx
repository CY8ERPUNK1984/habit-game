import React from 'react';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Геймификация жизни
      </h1>
      <p className="text-center mb-6">
        Превращайте ваши привычки в игру и достигайте целей
      </p>
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Добро пожаловать</h2>
        <p className="mb-4">
          Это базовый проект для приложения "Геймификация жизни". Скоро здесь появится
          больше функций.
        </p>
        <button 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Начать
        </button>
      </div>
    </div>
  );
} 