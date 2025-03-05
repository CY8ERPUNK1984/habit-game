import mongoose, { Document, Schema } from 'mongoose';

// Перечисление для типов достижений
export enum AchievementType {
  STREAK = 'streak',
  HABIT_COUNT = 'habit_count',
  TASK_COUNT = 'task_count',
  LEVEL = 'level',
  EXPERIENCE = 'experience',
  SPECIAL = 'special'
}

// Интерфейс для достижения
export interface IAchievement extends Document {
  title: string;
  description: string;
  type: AchievementType;
  icon: string;
  experienceReward: number;
  requiredValue: number;
  isVisible: boolean;
  isGlobal: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Схема достижения
const AchievementSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Название достижения обязательно'],
      trim: true,
      maxlength: [100, 'Название не может быть длиннее 100 символов'],
    },
    description: {
      type: String,
      required: [true, 'Описание достижения обязательно'],
      trim: true,
      maxlength: [500, 'Описание не может быть длиннее 500 символов'],
    },
    type: {
      type: String,
      enum: Object.values(AchievementType),
      required: [true, 'Тип достижения обязателен'],
    },
    icon: {
      type: String,
      default: 'default-achievement.png',
    },
    experienceReward: {
      type: Number,
      required: [true, 'Награда опытом обязательна'],
      min: [0, 'Награда не может быть отрицательной'],
    },
    requiredValue: {
      type: Number,
      required: [true, 'Требуемое значение обязательно'],
      min: [1, 'Требуемое значение должно быть не менее 1'],
    },
    isVisible: {
      type: Boolean,
      default: true,
      description: 'Видимо ли достижение до его получения',
    },
    isGlobal: {
      type: Boolean,
      default: true,
      description: 'Глобальное ли это достижение (для всех пользователей)',
    },
  },
  {
    timestamps: true,
  }
);

// Индексы для оптимизации запросов
AchievementSchema.index({ type: 1, requiredValue: 1 });
AchievementSchema.index({ isGlobal: 1 });

// Создание модели
export const AchievementModel = mongoose.model<IAchievement>('Achievement', AchievementSchema);

export default AchievementModel; 