import UserModel, { IUser } from '../models/User.model';
import { HabitCategory, HabitFrequency, HabitPriority } from '../models/Habit.model';

/**
 * Опыт, начисляемый за выполнение привычки в зависимости от частоты
 */
const EXPERIENCE_BY_FREQUENCY = {
  [HabitFrequency.DAILY]: 10,    // Ежедневные привычки
  [HabitFrequency.WEEKLY]: 30,   // Еженедельные привычки
  [HabitFrequency.MONTHLY]: 100, // Ежемесячные привычки
  [HabitFrequency.CUSTOM]: 15    // Пользовательские привычки
};

/**
 * Опыт, начисляемый за выполнение привычки в зависимости от приоритета
 */
const EXPERIENCE_BY_PRIORITY = {
  [HabitPriority.LOW]: 5,     // Низкий приоритет
  [HabitPriority.MEDIUM]: 10, // Средний приоритет
  [HabitPriority.HIGH]: 15    // Высокий приоритет
};

/**
 * Бонус опыта за серию выполнения привычки
 * @param streak Текущая серия выполнения привычки
 * @returns Бонус опыта
 */
const calculateStreakBonus = (streak: number): number => {
  if (streak <= 0) return 0;
  
  if (streak < 7) {
    return Math.floor(streak * 2); // 2 опыта за каждый день серии до 7 дней
  } else if (streak < 30) {
    return 14 + Math.floor((streak - 7) * 3); // Дополнительно 3 опыта за каждый день после 7 дней
  } else {
    return 14 + 69 + Math.floor((streak - 30) * 5); // Дополнительно 5 опыта за каждый день после 30 дней
  }
};

/**
 * Опыт, необходимый для достижения определенного уровня
 * @param level Уровень, для которого необходимо рассчитать опыт
 * @returns Требуемое количество опыта
 */
export const calculateExperienceForLevel = (level: number): number => {
  if (level <= 1) return 0;
  return Math.floor(100 * Math.pow(level - 1, 1.5));
};

/**
 * Расчет уровня, исходя из имеющегося опыта
 * @param experience Текущий опыт пользователя
 * @returns Уровень, соответствующий опыту
 */
export const calculateLevelFromExperience = (experience: number): number => {
  if (experience <= 0) return 1;
  
  let level = 1;
  while (calculateExperienceForLevel(level + 1) <= experience) {
    level++;
  }
  
  return level;
};

/**
 * Расчет опыта за выполнение привычки
 * @param frequency Частота привычки
 * @param priority Приоритет привычки
 * @param streak Текущая серия выполнения привычки
 * @returns Опыт за выполнение привычки
 */
export const calculateExperienceForCompletingHabit = (
  frequency: HabitFrequency,
  priority: HabitPriority,
  streak: number
): number => {
  const baseExperience = EXPERIENCE_BY_FREQUENCY[frequency] || EXPERIENCE_BY_FREQUENCY[HabitFrequency.DAILY];
  const priorityMultiplier = EXPERIENCE_BY_PRIORITY[priority] || EXPERIENCE_BY_PRIORITY[HabitPriority.MEDIUM];
  const streakBonus = calculateStreakBonus(streak);
  
  return baseExperience + priorityMultiplier + streakBonus;
};

/**
 * Обновляет опыт и уровень пользователя
 * @param userId ID пользователя
 * @param experienceToAdd Количество опыта для добавления
 * @returns Обновленный пользователь
 */
export const updateUserExperience = async (
  userId: string,
  experienceToAdd: number
): Promise<IUser | null> => {
  try {
    // Получаем пользователя для доступа к текущему опыту
    const user = await UserModel.findById(userId);
    if (!user) return null;
    
    // Обновляем опыт пользователя
    const newExperience = user.experience + experienceToAdd;
    const newLevel = calculateLevelFromExperience(newExperience);
    
    // Если уровень изменился, обновляем его
    if (newLevel > user.level) {
      return await UserModel.findByIdAndUpdate(
        userId,
        {
          $set: { level: newLevel, experience: newExperience }
        },
        { new: true }
      );
    } else {
      // Иначе обновляем только опыт
      return await UserModel.findByIdAndUpdate(
        userId,
        {
          $set: { experience: newExperience }
        },
        { new: true }
      );
    }
  } catch (error) {
    console.error('Ошибка при обновлении опыта пользователя:', error);
    return null;
  }
};

/**
 * Сервис для геймификации
 */
export default {
  calculateExperienceForCompletingHabit,
  calculateExperienceForLevel,
  calculateLevelFromExperience,
  updateUserExperience
}; 