import UserModel from '../../models/User.model';

describe('User Model', () => {
  // Тест для проверки создания пользователя
  it('should create a new user successfully', async () => {
    const userData = {
      name: 'Тест Юзер',
      email: 'test@example.com',
      password: 'password123'
    };

    const user = new UserModel(userData);
    const savedUser = await user.save();

    // Проверяем, что пользователь сохранен в БД
    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe(userData.name);
    expect(savedUser.email).toBe(userData.email);
    
    // Пароль должен быть захеширован
    expect(savedUser.password).not.toBe(userData.password);
    
    // Проверяем дефолтные значения
    expect(savedUser.level).toBe(1);
    expect(savedUser.experience).toBe(0);
    expect(savedUser.avatar).toBeDefined();
  });

  // Тест для проверки, что email должен быть уникальным
  it('should fail when email is not unique', async () => {
    // Создаем двух пользователей с одинаковым email
    const userData = {
      name: 'Первый Юзер',
      email: 'duplicate@example.com',
      password: 'password123'
    };

    const userData2 = {
      name: 'Второй Юзер',
      email: 'duplicate@example.com',
      password: 'password456'
    };

    // Сохраняем первого пользователя
    const user1 = new UserModel(userData);
    await user1.save();

    // Пытаемся сохранить второго пользователя с тем же email
    try {
      const user2 = new UserModel(userData2);
      await user2.save();
      
      // Если код дошел досюда, то тест должен провалиться
      // т.к. мы ожидаем ошибку валидации
      fail('Должна была возникнуть ошибка дублирования email');
    } catch (error) {
      // Проверяем, что ошибка связана с дублированием
      expect(error).toBeDefined();
      expect(error.name).toBe('MongoServerError');
      expect(error.code).toBe(11000); // Код ошибки для дубликата ключа в MongoDB
    }
  });

  // Тест для проверки хеширования пароля
  it('should hash the password before saving', async () => {
    const userData = {
      name: 'Хеш Юзер',
      email: 'hash@example.com',
      password: 'password123'
    };

    const user = new UserModel(userData);
    const savedUser = await user.save();

    // Проверяем, что пароль был захеширован
    expect(savedUser.password).not.toBe(userData.password);
    
    // Проверяем, что можно сравнить пароль с хешем
    const isMatch = await savedUser.comparePassword(userData.password);
    expect(isMatch).toBe(true);
    
    // Проверяем, что неверный пароль не совпадает
    const isWrongMatch = await savedUser.comparePassword('wrongpassword');
    expect(isWrongMatch).toBe(false);
  });

  // Тест для проверки валидации email
  it('should require valid email', async () => {
    const userData = {
      name: 'Валидация Юзер',
      email: 'invalidemail',
      password: 'password123'
    };

    try {
      const user = new UserModel(userData);
      await user.save();
      
      // Если код дошел досюда, то тест должен провалиться
      fail('Должна была возникнуть ошибка валидации email');
    } catch (error) {
      // Проверяем, что ошибка связана с валидацией
      expect(error).toBeDefined();
      expect(error.name).toBe('ValidationError');
      expect(error.errors.email).toBeDefined();
    }
  });

  // Тест для проверки обязательных полей
  it('should require name and password', async () => {
    const userData = {
      email: 'required@example.com',
      // Отсутствуют name и password
    };

    try {
      const user = new UserModel(userData);
      await user.save();
      
      fail('Должна была возникнуть ошибка отсутствия обязательных полей');
    } catch (error) {
      // Проверяем, что ошибка связана с валидацией
      expect(error).toBeDefined();
      expect(error.name).toBe('ValidationError');
      
      // Должны быть ошибки по отсутствующим полям
      expect(error.errors.name).toBeDefined();
      expect(error.errors.password).toBeDefined();
    }
  });
}); 