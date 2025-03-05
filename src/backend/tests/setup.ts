import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import dotenv from 'dotenv';

// Загрузка переменных окружения
dotenv.config();

// Переменная для хранения MongoDB сервера в памяти
let mongoServer: MongoMemoryServer;

// Подключение к тестовой in-memory базе данных
export const connectDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  await mongoose.connect(uri);
  console.log('Подключено к тестовой базе данных');
};

// Закрытие соединения с базой данных
export const closeDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
  console.log('Соединение с тестовой базой данных закрыто');
};

// Очистка всех коллекций перед каждым тестом
export const clearDB = async () => {
  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
  
  console.log('Коллекции очищены');
};

// Функция для запуска сервера MongoDB в памяти
beforeAll(async () => {
  // Создаем сервер MongoDB в памяти
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Устанавливаем URL подключения к тестовой БД
  process.env.MONGODB_TEST_URI = mongoUri;
  
  // Подключаемся к MongoDB в памяти
  await mongoose.connect(mongoUri);
  
  console.log(`MongoDB Memory Server запущен на ${mongoUri}`);
});

// Очистка коллекций между тестами
beforeEach(async () => {
  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
  
  console.log('Все коллекции успешно очищены');
});

// Закрытие соединения и остановка сервера после завершения тестов
afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
  
  console.log('Соединение с MongoDB закрыто, сервер остановлен');
});

// Увеличиваем таймаут для тестов, т.к. операции с MongoDB могут занимать время
jest.setTimeout(30000); 