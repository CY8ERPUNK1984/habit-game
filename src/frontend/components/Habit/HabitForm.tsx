'use client';

import { useState, useEffect, FormEvent } from 'react';
import { HabitFrequency, HabitCategory, HabitPriority } from '../../../backend/models/Habit.model';

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
  isLoading?: boolean;
  mode?: 'create' | 'edit';
}

const defaultFormData: HabitFormData = {
  title: '',
  description: '',
  frequency: HabitFrequency.DAILY,
  category: HabitCategory.OTHER,
  priority: HabitPriority.MEDIUM,
};

const HabitForm = ({ initialData = defaultFormData, onSubmit, isLoading = false, mode = 'create' }: HabitFormProps) => {
  const [formData, setFormData] = useState<HabitFormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Название привычки обязательно';
    }

    if (!formData.frequency) {
      newErrors.frequency = 'Частота выполнения обязательна';
    }

    if (!formData.category) {
      newErrors.category = 'Категория привычки обязательна';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value) {
      setFormData((prev) => ({
        ...prev,
        [name]: new Date(value),
      }));
    } else {
      setFormData((prev) => {
        const newData = { ...prev };
        delete newData.targetEndDate;
        return newData;
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      if (mode === 'create') {
        // Очищаем форму после успешного создания
        setFormData(defaultFormData);
      }
    } catch (error) {
      console.error('Ошибка при сохранении привычки:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Название привычки *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          disabled={isLoading}
          className={`mt-1 block w-full rounded-md border ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          } shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500`}
          placeholder="Например: Утренняя зарядка"
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Описание
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          disabled={isLoading}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Опишите детали вашей привычки"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
            Частота выполнения *
          </label>
          <select
            id="frequency"
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            disabled={isLoading}
            className={`mt-1 block w-full rounded-md border ${
              errors.frequency ? 'border-red-500' : 'border-gray-300'
            } shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500`}
          >
            <option value={HabitFrequency.DAILY}>Ежедневно</option>
            <option value={HabitFrequency.WEEKLY}>Еженедельно</option>
            <option value={HabitFrequency.MONTHLY}>Ежемесячно</option>
          </select>
          {errors.frequency && <p className="mt-1 text-sm text-red-600">{errors.frequency}</p>}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Категория *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={isLoading}
            className={`mt-1 block w-full rounded-md border ${
              errors.category ? 'border-red-500' : 'border-gray-300'
            } shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500`}
          >
            <option value={HabitCategory.HEALTH}>Здоровье</option>
            <option value={HabitCategory.EDUCATION}>Образование</option>
            <option value={HabitCategory.PRODUCTIVITY}>Продуктивность</option>
            <option value={HabitCategory.SOCIAL}>Социальные</option>
            <option value={HabitCategory.MINDFULNESS}>Осознанность</option>
            <option value={HabitCategory.CAREER}>Карьера</option>
            <option value={HabitCategory.FINANCE}>Финансы</option>
            <option value={HabitCategory.OTHER}>Другое</option>
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Приоритет
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            disabled={isLoading}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value={HabitPriority.LOW}>Низкий</option>
            <option value={HabitPriority.MEDIUM}>Средний</option>
            <option value={HabitPriority.HIGH}>Высокий</option>
          </select>
        </div>

        <div>
          <label htmlFor="targetEndDate" className="block text-sm font-medium text-gray-700">
            Целевая дата завершения
          </label>
          <input
            type="date"
            id="targetEndDate"
            name="targetEndDate"
            value={formData.targetEndDate ? new Date(formData.targetEndDate).toISOString().split('T')[0] : ''}
            onChange={handleDateChange}
            disabled={isLoading}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300"
        >
          {isLoading ? 'Сохранение...' : mode === 'create' ? 'Создать привычку' : 'Обновить привычку'}
        </button>
      </div>
    </form>
  );
};

export default HabitForm; 