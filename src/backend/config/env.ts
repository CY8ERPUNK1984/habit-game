import dotenv from 'dotenv';
import path from 'path';

// Загружаем переменные окружения из файла .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Интерфейс для переменных окружения
interface EnvVariables {
  NODE_ENV: string;
  PORT: number;
  MONGODB_URI: string;
  MONGODB_TEST_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
}

// Объект с переменными окружения
const env: EnvVariables = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/habit-game',
  MONGODB_TEST_URI: process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/habit-game-test',
  JWT_SECRET: process.env.JWT_SECRET || 'super-secret-key-for-development-only',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
};

// Валидация необходимых переменных окружения в продакшн среде
if (env.NODE_ENV === 'production') {
  const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
  
  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      throw new Error(`Ошибка окружения: ${varName} должен быть установлен в продакшн режиме`);
    }
  });
}

export default env; 