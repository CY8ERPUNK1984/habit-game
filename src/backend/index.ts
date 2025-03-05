import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';

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

// Корневой маршрут
app.get('/', (req, res) => {
  res.json({ message: 'API для геймификации жизни' });
});

// Подключение к MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/habit-game');
    console.log(`MongoDB подключен: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Ошибка подключения к MongoDB: ${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }
};

// Запуск сервера
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    });
  });
}

export default app; 