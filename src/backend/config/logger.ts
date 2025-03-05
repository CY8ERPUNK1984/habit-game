import winston from 'winston';
import path from 'path';

// Определяем уровни логирования и цвета для консоли
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Определяем цвета для каждого уровня логирования
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

// Добавляем цвета к winston
winston.addColors(colors);

// Определяем режим работы в зависимости от переменной окружения
const environment = process.env.NODE_ENV || 'development';
const isDevelopment = environment === 'development';

// Формат для логов
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf((info) => {
    const { timestamp, level, message, stack } = info;
    return `${timestamp} [${level.toUpperCase()}]: ${message}${stack ? `\n${stack}` : ''}`;
  })
);

// Формат для консоли с цветами
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  format
);

// Определяем пути для файлов логов
const logsDir = path.join(process.cwd(), 'logs');

// Создаем инстанс логгера
const logger = winston.createLogger({
  level: isDevelopment ? 'debug' : 'info',
  levels,
  format,
  transports: [
    // Всегда пишем логи в консоль
    new winston.transports.Console({
      format: consoleFormat,
    }),
    
    // Пишем все логи уровня info и ниже в файл app.log
    new winston.transports.File({
      filename: path.join(logsDir, 'app.log'),
      level: 'info',
    }),
    
    // Пишем логи ошибок в отдельный файл
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
    }),
  ],
  // Не выходить из процесса при необработанных ошибках
  exitOnError: false,
});

// Экспортируем логгер
export default logger; 