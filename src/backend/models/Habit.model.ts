import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User.model';

// Интерфейс для истории выполнения привычки
export interface ICompletionRecord {
  date: Date;
  completed: boolean;
}

// Перечисления для привычек
export enum HabitFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  CUSTOM = 'custom'
}

export enum HabitCategory {
  HEALTH = 'health',
  PRODUCTIVITY = 'productivity',
  EDUCATION = 'education',
  SOCIAL = 'social',
  MINDFULNESS = 'mindfulness',
  CAREER = 'career',
  FINANCE = 'finance',
  OTHER = 'other'
}

export enum HabitPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

// Интерфейс для привычки
export interface IHabit extends Document {
  title: string;
  description?: string;
  user: IUser['_id'];
  frequency: HabitFrequency;
  customFrequencyDays?: number[];
  category: HabitCategory;
  priority: HabitPriority;
  streak: number;
  completedToday: boolean;
  completionHistory: ICompletionRecord[];
  experiencePoints: number;
  startDate: Date;
  targetEndDate?: Date;
  reminderTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Схема привычки
const HabitSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Название привычки обязательно'],
      trim: true,
      maxlength: [100, 'Название не может быть длиннее 100 символов'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Описание не может быть длиннее 500 символов'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Привычка должна быть связана с пользователем'],
    },
    frequency: {
      type: String,
      enum: Object.values(HabitFrequency),
      default: HabitFrequency.DAILY,
    },
    customFrequencyDays: {
      type: [Number],
      validate: {
        validator: function(days: number[]) {
          return days.every(day => day >= 0 && day <= 6);
        },
        message: 'Дни недели должны быть числами от 0 (воскресенье) до 6 (суббота)'
      }
    },
    category: {
      type: String,
      enum: Object.values(HabitCategory),
      default: HabitCategory.OTHER,
    },
    priority: {
      type: String,
      enum: Object.values(HabitPriority),
      default: HabitPriority.MEDIUM,
    },
    streak: {
      type: Number,
      default: 0,
    },
    completedToday: {
      type: Boolean,
      default: false,
    },
    completionHistory: [
      {
        date: {
          type: Date,
          required: true,
        },
        completed: {
          type: Boolean,
          required: true,
        },
      },
    ],
    experiencePoints: {
      type: Number,
      default: 10,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    targetEndDate: {
      type: Date,
    },
    reminderTime: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Создание индексов для оптимизации запросов
HabitSchema.index({ user: 1, title: 1 }, { unique: true });
HabitSchema.index({ user: 1, category: 1 });
HabitSchema.index({ user: 1, frequency: 1 });

// Middleware для обновления "completedToday" каждый день
HabitSchema.pre('find', function() {
  this.setQuery({ 
    ...this.getQuery(), 
    completedToday: { 
      $expr: { 
        $eq: [
          { $dateToString: { format: '%Y-%m-%d', date: '$completionHistory.date' } },
          { $dateToString: { format: '%Y-%m-%d', date: new Date() } }
        ]
      }
    }
  });
});

// Создание модели
export const HabitModel = mongoose.model<IHabit>('Habit', HabitSchema);

export default HabitModel; 