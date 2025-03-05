import React, { useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  level: number;
  experience: number;
  avatar: string;
}

interface ProfileEditFormProps {
  user: User;
  onSubmit: (data: { name: string; avatar: string }) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ 
  user, 
  onSubmit, 
  onCancel, 
  isSubmitting = false 
}) => {
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [errors, setErrors] = useState<{ name?: string; avatar?: string }>({});

  // Обработчик отправки формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация формы
    const validationErrors: { name?: string; avatar?: string } = {};
    
    if (!name.trim()) {
      validationErrors.name = 'Имя не может быть пустым';
    }
    
    // Если есть ошибки, обновляем состояние и прерываем отправку
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Если ошибок нет, очищаем состояние ошибок и отправляем форму
    setErrors({});
    onSubmit({ name, avatar });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" role="form">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Имя
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            errors.name ? 'border-red-500' : ''
          }`}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={user.email}
          disabled
          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
        />
        <p className="mt-1 text-sm text-gray-500">
          Email не может быть изменен
        </p>
      </div>

      <div>
        <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
          URL аватара
        </label>
        <input
          type="text"
          id="avatar"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            errors.avatar ? 'border-red-500' : ''
          }`}
        />
        {errors.avatar && (
          <p className="mt-1 text-sm text-red-600">{errors.avatar}</p>
        )}
        
        {avatar && (
          <div className="mt-2">
            <p className="text-sm font-medium text-gray-700 mb-1">Предпросмотр аватара:</p>
            <img 
              src={avatar} 
              alt="Предпросмотр аватара" 
              className="w-16 h-16 object-cover rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/default-avatar.png';
              }}
            />
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Отмена
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white 
            ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </div>
    </form>
  );
};

export default ProfileEditForm; 