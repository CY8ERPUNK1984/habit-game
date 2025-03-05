'use client';

import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

interface LevelUpEffectProps {
  level: number;
  show: boolean;
  onClose: () => void;
}

const LevelUpEffect = ({ level, show, onClose }: LevelUpEffectProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      
      // Запускаем эффект конфетти
      const duration = 3000;
      const end = Date.now() + duration;
      
      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#5046e5', '#34d399', '#f472b6']
        });
        
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#5046e5', '#34d399', '#f472b6']
        });
        
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      
      frame();
      
      // Автоматически закрываем через 5 секунд
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 500); // Даем время для анимации закрытия
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 500); // Даем время для анимации закрытия
  };

  // Слушаем нажатие клавиши Escape на уровне документа
  useEffect(() => {
    if (visible) {
      const handleEscKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleClose();
        }
      };

      document.addEventListener('keydown', handleEscKey);
      return () => {
        document.removeEventListener('keydown', handleEscKey);
      };
    }
  }, [visible]);

  if (!show && !visible) return null;

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}
      aria-modal="true"
      role="dialog"
      aria-labelledby="level-up-title"
    >
      {/* Невидимая кнопка закрытия на весь экран */}
      <button
        className="absolute inset-0 w-full h-full cursor-default bg-transparent"
        onClick={handleClose}
        aria-label="Закрыть окно"
      />
      
      <div 
        className={`bg-white rounded-lg p-8 max-w-md text-center transform transition-transform duration-500 relative z-10 ${visible ? 'scale-100' : 'scale-90'}`}
      >
        <h2 id="level-up-title" className="text-3xl font-bold text-indigo-600 mb-4">Поздравляем!</h2>
        <div className="bg-indigo-600 text-white rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-4 text-4xl font-bold">
          {level}
        </div>
        <p className="text-2xl font-semibold mb-3">Вы достигли уровня {level}!</p>
        <p className="text-gray-600 mb-6">Продолжайте выполнять привычки и ставить новые цели, чтобы расти дальше.</p>
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleClose}
        >
          Продолжить
        </button>
      </div>
    </div>
  );
};

export default LevelUpEffect; 