import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';

// Загрузка переменных окружения
dotenv.config();

// Создание express приложения
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Маршруты
app.use('/api/auth', authRoutes);

// Корневой маршрут
app.get('/', (req, res) => {
  res.json({ message: 'API для геймификации жизни' });
});

// Обработка ошибок
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Внутренняя ошибка сервера',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Подключение к MongoDB и запуск сервера
const PORT = process.env.PORT || 5000;
const DB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/habit-game';

mongoose
  .connect(DB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
      console.log(`Подключен к MongoDB: ${DB_URI}`);
    });
  })
  .catch((err) => {
    console.error('Ошибка при подключении к MongoDB:', err);
    process.exit(1);
  });

export default app; 