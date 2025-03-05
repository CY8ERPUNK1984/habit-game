import mongoose from 'mongoose';
import { env } from './env';
import logger from './logger';

// Опции подключения
const options: mongoose.ConnectOptions = {
  autoIndex: true, // В продакшене следует отключить для повышения производительности
  serverSelectionTimeoutMS: 5000, // Таймаут выбора сервера
  socketTimeoutMS: 45000, // Время ожидания сокета
};

// Класс для управления подключением к базе данных
export class DatabaseService {
  private static instance: DatabaseService;
  private isConnected = false;

  // Синглтон для предотвращения множественных подключений
  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // Подключение к базе данных
  public async connect(): Promise<void> {
    if (this.isConnected) {
      logger.info('БД уже подключена');
      return;
    }

    try {
      // Определяем, какой URI использовать на основе режима
      const uri = process.env.NODE_ENV === 'test' 
        ? env.MONGODB_TEST_URI 
        : env.MONGODB_URI;
      
      // Подключаемся к MongoDB
      await mongoose.connect(uri, options);
      
      this.isConnected = true;
      logger.info(`Успешное подключение к MongoDB в режиме: ${process.env.NODE_ENV}`);
      
      // Обработка событий подключения
      mongoose.connection.on('error', (err) => {
        logger.error(`Ошибка соединения с MongoDB: ${err}`);
        this.isConnected = false;
      });
      
      mongoose.connection.on('disconnected', () => {
        logger.warn('Соединение с MongoDB потеряно');
        this.isConnected = false;
      });
    } catch (error) {
      logger.error(`Не удалось подключиться к MongoDB: ${error}`);
      this.isConnected = false;
      process.exit(1); // Выход при невозможности подключения к БД
    }
  }

  // Отключение от базы данных
  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }
    
    try {
      await mongoose.disconnect();
      this.isConnected = false;
      logger.info('Отключение от MongoDB выполнено');
    } catch (error) {
      logger.error(`Ошибка при отключении от MongoDB: ${error}`);
    }
  }

  // Очистка базы данных (для тестов)
  public async clearDatabase(): Promise<void> {
    if (process.env.NODE_ENV !== 'test') {
      logger.error('Очистка БД разрешена только в тестовом режиме');
      return;
    }

    try {
      const collections = mongoose.connection.collections;
      for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
      }
      logger.info('БД успешно очищена');
    } catch (error) {
      logger.error(`Ошибка при очистке БД: ${error}`);
    }
  }
}

// Экспортируем экземпляр для удобства использования
export const dbService = DatabaseService.getInstance();

export default dbService; 