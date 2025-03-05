import { dbService } from './database';
import logger from './logger';
import UserModel from '../models/User.model';
import AchievementModel from '../models/Achievement.model';
import { AchievementType } from '../models/Achievement.model';
import { env } from './env';

/**
 * Создание начальных достижений
 */
async function seedAchievements(): Promise<void> {
  const achievementsCount = await AchievementModel.countDocuments();
  
  if (achievementsCount > 0) {
    logger.info('Достижения уже существуют, пропускаем инициализацию');
    return;
  }

  logger.info('Создание начальных достижений...');

  const achievements = [
    {
      title: 'Первые шаги',
      description: 'Создайте свою первую привычку',
      type: AchievementType.HABIT_COUNT,
      icon: '🌱',
      experienceReward: 50,
      requiredValue: 1,
      isVisible: true,
      isGlobal: true,
    },
    {
      title: 'Начинающий',
      description: 'Выполните привычку 5 дней подряд',
      type: AchievementType.STREAK,
      icon: '🔥',
      experienceReward: 100,
      requiredValue: 5,
      isVisible: true,
      isGlobal: true,
    },
    {
      title: 'Мастер привычек',
      description: 'Создайте 10 привычек',
      type: AchievementType.HABIT_COUNT,
      icon: '🏆',
      experienceReward: 200,
      requiredValue: 10,
      isVisible: true,
      isGlobal: true,
    },
    {
      title: 'Организатор',
      description: 'Выполните 20 задач',
      type: AchievementType.TASK_COUNT,
      icon: '📋',
      experienceReward: 150,
      requiredValue: 20,
      isVisible: true,
      isGlobal: true,
    },
    {
      title: 'Уровень 5',
      description: 'Достигните 5 уровня',
      type: AchievementType.LEVEL,
      icon: '⭐',
      experienceReward: 300,
      requiredValue: 5,
      isVisible: true,
      isGlobal: true,
    }
  ];

  try {
    await AchievementModel.insertMany(achievements);
    logger.info(`Создано ${achievements.length} достижений`);
  } catch (error) {
    logger.error(`Ошибка при создании достижений: ${error}`);
  }
}

/**
 * Создание тестового администратора (только в режиме разработки)
 */
async function seedAdminUser(): Promise<void> {
  // Создаем администратора только в режиме разработки
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  const adminEmail = 'admin@example.com';
  const existingAdmin = await UserModel.findOne({ email: adminEmail });

  if (existingAdmin) {
    logger.info('Администратор уже существует, пропускаем инициализацию');
    return;
  }

  logger.info('Создание тестового администратора...');

  try {
    const admin = new UserModel({
      name: 'Администратор',
      email: adminEmail,
      password: 'password123', // Будет хешироваться через хук pre-save
      level: 10,
      experience: 1000,
      isAdmin: true
    });

    await admin.save();
    logger.info('Тестовый администратор создан успешно');
  } catch (error) {
    logger.error(`Ошибка при создании администратора: ${error}`);
  }
}

/**
 * Основная функция для инициализации БД
 */
export async function seedDatabase(): Promise<void> {
  logger.info('Начинаем инициализацию базы данных...');
  
  try {
    // Подключаемся к БД
    await dbService.connect();
    
    // Выполняем все функции инициализации
    await seedAchievements();
    await seedAdminUser();
    
    logger.info('Инициализация базы данных завершена успешно');
  } catch (error) {
    logger.error(`Ошибка при инициализации базы данных: ${error}`);
  }
}

// Выполняем инициализацию, если скрипт запущен напрямую
if (require.main === module) {
  seedDatabase()
    .then(() => {
      logger.info('Скрипт инициализации завершен');
      process.exit(0);
    })
    .catch((error) => {
      logger.error(`Ошибка выполнения скрипта инициализации: ${error}`);
      process.exit(1);
    });
}

export default seedDatabase; 