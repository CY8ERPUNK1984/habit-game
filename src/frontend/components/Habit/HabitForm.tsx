'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HabitCategory, HabitFrequency, HabitPriority } from '../../../backend/models/Habit.model';

export interface HabitFormData {
  title: string;
  description: string;
  frequency: HabitFrequency;
  category: HabitCategory;
  priority: HabitPriority;
  targetEndDate?: Date;
}

interface HabitFormProps {
  initialData?: HabitFormData;
  onSubmit: (data: HabitFormData) => Promise<void>;
  isLoading: boolean;
  mode: 'create' | 'edit';
}

const defaultFormData: HabitFormData = {
  title: '',
  description: '',
  frequency: HabitFrequency.DAILY,
  category: HabitCategory.HEALTH,
  priority: HabitPriority.MEDIUM,
};

const HabitForm = ({ initialData = defaultFormData, onSubmit, isLoading, mode }: HabitFormProps) => {
  const [formData, setFormData] = useState<HabitFormData>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof HabitFormData, string>>>({});
  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof HabitFormData, string>> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Название привычки обязательно';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Название привычки не должно превышать 100 символов';
    }
    
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Описание не должно превышать 500 символов';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Очищаем ошибку при изменении поля
    if (errors[name as keyof HabitFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      targetEndDate: value ? new Date(value) : undefined 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
          Название привычки*
        </label>
        <input
          className={`shadow appearance-none border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
          id="title"
          name="title"
          type="text"
          placeholder="Название привычки"
          value={formData.title}
          onChange={handleChange}
          disabled={isLoading}
        />
        {errors.title && <p className="text-red-500 text-xs italic">{errors.title}</p>}
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
          Описание
        </label>
        <textarea
          className={`shadow appearance-none border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
          id="description"
          name="description"
          placeholder="Описание привычки"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          disabled={isLoading}
        />
        {errors.description && <p className="text-red-500 text-xs italic">{errors.description}</p>}
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
          Категория
        </label>
        <select
          className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          disabled={isLoading}
        >
          <option value={HabitCategory.HEALTH}>Здоровье</option>
          <option value={HabitCategory.PRODUCTIVITY}>Продуктивность</option>
          <option value={HabitCategory.EDUCATION}>Образование</option>
          <option value={HabitCategory.SOCIAL}>Социальные</option>
          <option value={HabitCategory.MINDFULNESS}>Осознанность</option>
          <option value={HabitCategory.CAREER}>Карьера</option>
          <option value={HabitCategory.FINANCE}>Финансы</option>
          <option value={HabitCategory.OTHER}>Другое</option>
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="frequency">
          Частота
        </label>
        <select
          className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="frequency"
          name="frequency"
          value={formData.frequency}
          onChange={handleChange}
          disabled={isLoading}
        >
          <option value={HabitFrequency.DAILY}>Ежедневно</option>
          <option value={HabitFrequency.WEEKLY}>Еженедельно</option>
          <option value={HabitFrequency.MONTHLY}>Ежемесячно</option>
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="priority">
          Приоритет
        </label>
        <select
          className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          disabled={isLoading}
        >
          <option value={HabitPriority.LOW}>Низкий</option>
          <option value={HabitPriority.MEDIUM}>Средний</option>
          <option value={HabitPriority.HIGH}>Высокий</option>
        </select>
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="targetEndDate">
          Целевая дата завершения (опционально)
        </label>
        <input
          className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="targetEndDate"
          name="targetEndDate"
          type="date"
          value={formData.targetEndDate ? formData.targetEndDate.toISOString().split('T')[0] : ''}
          onChange={handleDateChange}
          disabled={isLoading}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <button
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Сохранение...
            </span>
          ) : (
            mode === 'create' ? 'Создать привычку' : 'Сохранить изменения'
          )}
        </button>
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Отмена
        </button>
      </div>
    </form>
  );
};

export default HabitForm; 