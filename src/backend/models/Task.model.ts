import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User.model';

// Перечисление для размеров задач
export enum TaskSize {
  SMALL = 'S',
  MEDIUM = 'M',
  LARGE = 'L'
}

// Перечисление для статусов задач
export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// Интерфейс для задачи
export interface ITask extends Document {
  title: string;
  description?: string;
  user: IUser['_id'];
  size: TaskSize;
  status: TaskStatus;
  experiencePoints: number;
  dueDate?: Date;
  completedDate?: Date;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Схема задачи
const TaskSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Название задачи обязательно'],
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
      required: [true, 'Задача должна быть связана с пользователем'],
    },
    size: {
      type: String,
      enum: Object.values(TaskSize),
      default: TaskSize.MEDIUM,
      required: [true, 'Размер задачи обязателен'],
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.TODO,
    },
    experiencePoints: {
      type: Number,
      default: function(this: any) {
        // Опыт в зависимости от размера задачи
        switch (this.size) {
          case TaskSize.SMALL:
            return 10;
          case TaskSize.MEDIUM:
            return 30;
          case TaskSize.LARGE:
            return 80;
          default:
            return 30;
        }
      },
    },
    dueDate: {
      type: Date,
    },
    completedDate: {
      type: Date,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Индексы для оптимизации запросов
TaskSchema.index({ user: 1, status: 1 });
TaskSchema.index({ user: 1, dueDate: 1 });
TaskSchema.index({ user: 1, tags: 1 });

// Метод для завершения задачи
TaskSchema.methods.complete = function(): void {
  this.status = TaskStatus.COMPLETED;
  this.completedDate = new Date();
};

// Создание модели
export const TaskModel = mongoose.model<ITask>('Task', TaskSchema);

export default TaskModel; 