// Увеличиваем таймаут для тестов
jest.setTimeout(30000);

// Мокаем mongoose
jest.mock('mongoose', () => {
  const mongoose = jest.requireActual('mongoose');
  
  return {
    ...mongoose,
    connect: jest.fn().mockResolvedValue(mongoose),
    connection: {
      ...mongoose.connection,
      once: jest.fn(),
      on: jest.fn(),
    },
  };
});

// Мокаем bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

// Мокаем jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('token'),
  verify: jest.fn().mockReturnValue({ id: 'userId' }),
}));

// Очищаем все моки после каждого теста
afterEach(() => {
  jest.clearAllMocks();
}); 