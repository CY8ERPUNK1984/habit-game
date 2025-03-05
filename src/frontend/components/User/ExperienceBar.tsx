'use client';

import React from 'react';

// Константы для расчета опыта на уровень
const BASE_XP = 100; // Базовый опыт для первого уровня
const XP_MULTIPLIER = 1.5; // Множитель опыта для каждого следующего уровня

interface ExperienceBarProps {
  level: number;
  experience: number;
  className?: string;
}

/**
 * Рассчитывает требуемый опыт для достижения следующего уровня
 */
const calculateNextLevelXP = (level: number): number => {
  return Math.round(BASE_XP * Math.pow(XP_MULTIPLIER, level - 1));
};

/**
 * Рассчитывает общий опыт, необходимый для текущего уровня
 */
const calculateCurrentLevelTotalXP = (level: number): number => {
  if (level <= 1) return 0;
  return Math.round(BASE_XP * (Math.pow(XP_MULTIPLIER, level - 1) - 1) / (XP_MULTIPLIER - 1));
};

/**
 * Компонент полосы опыта, отображающий прогресс пользователя до следующего уровня
 */
const ExperienceBar: React.FC<ExperienceBarProps> = ({ level, experience, className = '' }) => {
  // Общий опыт, необходимый для достижения текущего уровня
  const currentLevelTotalXP = calculateCurrentLevelTotalXP(level);
  
  // Требуемый опыт для следующего уровня
  const nextLevelXP = calculateNextLevelXP(level);
  
  // Опыт, накопленный с момента достижения текущего уровня
  const currentLevelProgress = experience - currentLevelTotalXP;
  
  // Процент прогресса до следующего уровня
  const progressPercent = Math.min(Math.round((currentLevelProgress / nextLevelXP) * 100), 100);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between mb-1 text-sm">
        <span>Уровень {level}</span>
        <span>{currentLevelProgress}/{nextLevelXP} XP</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
      <div className="flex justify-end mt-1">
        <span className="text-xs text-gray-500">
          До уровня {level + 1}: {nextLevelXP - currentLevelProgress} XP
        </span>
      </div>
    </div>
  );
};

export default ExperienceBar; 