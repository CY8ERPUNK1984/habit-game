import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

// Интерфейс для пользователя
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  level: number;
  experience: number;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Схема пользователя
const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Имя пользователя обязательно'],
      trim: true,
      maxlength: [50, 'Имя не может быть длиннее 50 символов'],
    },
    email: {
      type: String,
      required: [true, 'Email обязателен'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Пожалуйста, введите корректный email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Пароль обязателен'],
      minlength: [8, 'Пароль должен быть не менее 8 символов'],
      select: false, // Не возвращаем пароль при запросах
    },
    avatar: {
      type: String,
      default: 'default-avatar.png',
    },
    level: {
      type: Number,
      default: 1,
    },
    experience: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Добавляет поля createdAt и updatedAt
  }
);

// Хеширование пароля перед сохранением
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Метод для сравнения паролей
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Создание модели
export const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel; 