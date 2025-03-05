import jwt from 'jsonwebtoken';

/**
 * Генерирует JWT токен для пользователя
 * @param id ID пользователя
 * @returns JWT токен
 */
export const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d'
  });
}; 