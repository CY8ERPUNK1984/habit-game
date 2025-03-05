import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User.model';
import { IAchievement } from './Achievement.model';

// Интерфейс для связи пользователь-достижение
export interface IUserAchievement extends Document {
  user: IUser['_id'];
  achievement: IAchievement['_id'];
  earnedDate: Date;
  progress: number;
  claimed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Схема связи пользователь-достижение
const UserAchievementSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Пользователь обязателен'],
    },
    achievement: {
      type: Schema.Types.ObjectId,
      ref: 'Achievement',
      required: [true, 'Достижение обязательно'],
    },
    earnedDate: {
      type: Date,
      default: null,
    },
    progress: {
      type: Number,
      default: 0,
      min: [0, 'Прогресс не может быть отрицательным'],
    },
    claimed: {
      type: Boolean,
      default: false,
      description: 'Получена ли награда за достижение',
    },
  },
  {
    timestamps: true,
  }
);

// Индексы для оптимизации запросов
UserAchievementSchema.index({ user: 1, achievement: 1 }, { unique: true });
UserAchievementSchema.index({ user: 1, claimed: 1 });
UserAchievementSchema.index({ user: 1, earnedDate: 1 });

// Создание модели
export const UserAchievementModel = mongoose.model<IUserAchievement>('UserAchievement', UserAchievementSchema);

export default UserAchievementModel; 