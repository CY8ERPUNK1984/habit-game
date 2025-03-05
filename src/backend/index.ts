import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import habitRoutes from './routes/habits.routes';
import statsRoutes from './routes/stats.routes';
import { errorHandler } from './middleware/error.middleware';

// Загрузка переменных окружения
dotenv.config();

// Создание express приложения
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Маршруты
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/stats', statsRoutes);

// Обработка ошибок
app.use(errorHandler);

// Корневой маршрут
app.get('/', (req, res) => {
  res.json({ message: 'API для геймификации жизни' });
});

// Подключение к MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/habit-game');
    console.log(`MongoDB подключена: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Ошибка: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

// Запуск сервера
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

export default app; 