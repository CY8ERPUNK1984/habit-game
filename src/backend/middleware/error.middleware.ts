import { Request, Response, NextFunction } from 'express';

/**
 * Middleware для обработки ошибок
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Ошибка:', err.stack);

  res.status(500).json({
    success: false,
    error: 'Внутренняя ошибка сервера',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};

export default errorHandler; 