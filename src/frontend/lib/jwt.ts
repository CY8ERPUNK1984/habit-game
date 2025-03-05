import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

// Верификация JWT-токена
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as TokenPayload;
    return decoded;
  } catch (error) {
    console.error('Ошибка верификации токена:', error);
    return null;
  }
};

// Генерация JWT-токена (используется только на бэкенде или для тестов)
export const generateToken = (userId: string, email: string): string => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET || 'default_secret',
    { expiresIn: '1d' }
  );
}; 