# Стратегия тестирования

В этом документе описана стратегия тестирования проекта "Геймификация жизни v0.2". Проект разрабатывается с использованием методологии TDD (Test-Driven Development), что означает, что тесты пишутся до реализации функциональности.

## Уровни тестирования

### 1. Модульное тестирование (Unit Testing)

Модульные тесты проверяют отдельные компоненты или функции в изоляции от остальной системы. Для модульного тестирования используются следующие инструменты:

- **Frontend**: Jest + React Testing Library
- **Backend**: Jest + Supertest

#### Примеры модульных тестов:

**Frontend**:
```javascript
// Тест компонента HabitCard
describe('HabitCard', () => {
  it('должен отображать название привычки', () => {
    const habit = {
      _id: '1',
      name: 'Отказ от игр',
      description: 'Не играть в компьютерные игры',
      progress: 5,
      goal: 30
    };
    
    render(<HabitCard habit={habit} />);
    
    expect(screen.getByText('Отказ от игр')).toBeInTheDocument();
  });
  
  it('должен отображать прогресс привычки', () => {
    const habit = {
      _id: '1',
      name: 'Отказ от игр',
      description: 'Не играть в компьютерные игры',
      progress: 5,
      goal: 30
    };
    
    render(<HabitCard habit={habit} />);
    
    expect(screen.getByText('5/30')).toBeInTheDocument();
  });
  
  it('должен вызывать функцию onComplete при нажатии на кнопку', () => {
    const habit = {
      _id: '1',
      name: 'Отказ от игр',
      description: 'Не играть в компьютерные игры',
      progress: 5,
      goal: 30
    };
    
    const onComplete = jest.fn();
    
    render(<HabitCard habit={habit} onComplete={onComplete} />);
    
    fireEvent.click(screen.getByText('Отметить выполнение'));
    
    expect(onComplete).toHaveBeenCalledWith('1');
  });
});
```

**Backend**:
```javascript
// Тест сервиса HabitService
describe('HabitService', () => {
  it('должен создавать новую привычку', async () => {
    const habitData = {
      name: 'Отказ от игр',
      description: 'Не играть в компьютерные игры',
      goal: 30
    };
    
    const userId = 'user123';
    
    const createdHabit = await HabitService.createHabit(userId, habitData);
    
    expect(createdHabit).toHaveProperty('_id');
    expect(createdHabit.name).toBe(habitData.name);
    expect(createdHabit.description).toBe(habitData.description);
    expect(createdHabit.goal).toBe(habitData.goal);
    expect(createdHabit.userId).toBe(userId);
    expect(createdHabit.progress).toBe(0);
  });
  
  it('должен обновлять прогресс привычки', async () => {
    const habitId = 'habit123';
    const userId = 'user123';
    
    // Создаем мок привычки в базе данных
    const habit = {
      _id: habitId,
      userId,
      name: 'Отказ от игр',
      description: 'Не играть в компьютерные игры',
      progress: 5,
      goal: 30,
      history: []
    };
    
    // Мокаем метод findById
    jest.spyOn(Habit, 'findById').mockResolvedValue(habit);
    
    // Мокаем метод save
    const saveMock = jest.fn().mockResolvedValue({
      ...habit,
      progress: 6,
      history: [{ date: new Date(), completed: true }]
    });
    
    habit.save = saveMock;
    
    const result = await HabitService.completeHabit(userId, habitId);
    
    expect(result.habit.progress).toBe(6);
    expect(result.habit.history).toHaveLength(1);
    expect(saveMock).toHaveBeenCalled();
  });
});
```

### 2. Интеграционное тестирование (Integration Testing)

Интеграционные тесты проверяют взаимодействие между различными компонентами системы. Для интеграционного тестирования используются следующие инструменты:

- **Frontend**: Jest + React Testing Library
- **Backend**: Jest + Supertest

#### Примеры интеграционных тестов:

**Frontend**:
```javascript
// Тест интеграции компонентов HabitList и HabitCard
describe('HabitList', () => {
  it('должен отображать список привычек', async () => {
    // Мокаем API-запрос
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        success: true,
        data: {
          habits: [
            {
              _id: '1',
              name: 'Отказ от игр',
              description: 'Не играть в компьютерные игры',
              progress: 5,
              goal: 30
            },
            {
              _id: '2',
              name: 'Создание продуктов',
              description: 'Создавать продукты с использованием кода и ИИ',
              progress: 1,
              goal: 10
            }
          ]
        }
      })
    });
    
    render(<HabitList />);
    
    // Ждем, пока данные загрузятся
    await waitFor(() => {
      expect(screen.getByText('Отказ от игр')).toBeInTheDocument();
      expect(screen.getByText('Создание продуктов')).toBeInTheDocument();
    });
    
    // Проверяем, что компоненты HabitCard отображаются корректно
    expect(screen.getByText('5/30')).toBeInTheDocument();
    expect(screen.getByText('1/10')).toBeInTheDocument();
  });
  
  it('должен обновлять привычку при нажатии на кнопку', async () => {
    // Мокаем API-запросы
    const fetchMock = jest.spyOn(global, 'fetch');
    
    // Мок для получения списка привычек
    fetchMock.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({
        success: true,
        data: {
          habits: [
            {
              _id: '1',
              name: 'Отказ от игр',
              description: 'Не играть в компьютерные игры',
              progress: 5,
              goal: 30
            }
          ]
        }
      })
    });
    
    // Мок для обновления привычки
    fetchMock.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({
        success: true,
        data: {
          habit: {
            _id: '1',
            name: 'Отказ от игр',
            description: 'Не играть в компьютерные игры',
            progress: 6,
            goal: 30
          },
          user: {
            xp: 15,
            level: 1
          },
          newAchievements: []
        }
      })
    });
    
    render(<HabitList />);
    
    // Ждем, пока данные загрузятся
    await waitFor(() => {
      expect(screen.getByText('Отказ от игр')).toBeInTheDocument();
    });
    
    // Нажимаем на кнопку "Отметить выполнение"
    fireEvent.click(screen.getByText('Отметить выполнение'));
    
    // Проверяем, что был сделан запрос на обновление привычки
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.habit-game.com/api/habits/1/complete',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Authorization': expect.any(String)
        })
      })
    );
    
    // Ждем, пока данные обновятся
    await waitFor(() => {
      expect(screen.getByText('6/30')).toBeInTheDocument();
    });
  });
});
```

**Backend**:
```javascript
// Тест API-эндпоинта для создания привычки
describe('POST /api/habits', () => {
  it('должен создавать новую привычку', async () => {
    // Создаем тестового пользователя
    const user = await User.create({
      username: 'testuser',
      password: 'password123'
    });
    
    // Получаем токен для пользователя
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    
    // Отправляем запрос на создание привычки
    const response = await request(app)
      .post('/api/habits')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Отказ от игр',
        description: 'Не играть в компьютерные игры',
        goal: 30
      });
    
    // Проверяем ответ
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.habit).toHaveProperty('_id');
    expect(response.body.data.habit.name).toBe('Отказ от игр');
    expect(response.body.data.habit.description).toBe('Не играть в компьютерные игры');
    expect(response.body.data.habit.goal).toBe(30);
    expect(response.body.data.habit.progress).toBe(0);
    
    // Проверяем, что привычка сохранена в базе данных
    const habit = await Habit.findById(response.body.data.habit._id);
    expect(habit).not.toBeNull();
    expect(habit.userId.toString()).toBe(user._id.toString());
  });
  
  it('должен возвращать ошибку при отсутствии токена', async () => {
    // Отправляем запрос без токена
    const response = await request(app)
      .post('/api/habits')
      .send({
        name: 'Отказ от игр',
        description: 'Не играть в компьютерные игры',
        goal: 30
      });
    
    // Проверяем ответ
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.error.message).toBe('Токен не предоставлен');
  });
  
  it('должен возвращать ошибку при неверном формате данных', async () => {
    // Создаем тестового пользователя
    const user = await User.create({
      username: 'testuser2',
      password: 'password123'
    });
    
    // Получаем токен для пользователя
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    
    // Отправляем запрос с неверным форматом данных (отсутствует name)
    const response = await request(app)
      .post('/api/habits')
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: 'Не играть в компьютерные игры',
        goal: 30
      });
    
    // Проверяем ответ
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.message).toContain('name');
  });
});
```

### 3. End-to-End тестирование (E2E Testing)

End-to-End тесты проверяют работу всей системы в целом, имитируя действия пользователя. Для E2E-тестирования используется Cypress.

#### Примеры E2E-тестов:

```javascript
// Тест регистрации и входа пользователя
describe('Аутентификация', () => {
  it('должен регистрировать нового пользователя и входить в систему', () => {
    // Генерируем уникальное имя пользователя
    const username = `testuser_${Date.now()}`;
    const password = 'password123';
    
    // Переходим на страницу регистрации
    cy.visit('/register');
    
    // Заполняем форму регистрации
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
    
    // Проверяем, что пользователь перенаправлен на главную страницу
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    
    // Проверяем, что пользователь авторизован
    cy.get('[data-testid="user-menu"]').should('contain', username);
    
    // Выходим из системы
    cy.get('[data-testid="user-menu"]').click();
    cy.get('[data-testid="logout-button"]').click();
    
    // Проверяем, что пользователь вышел из системы
    cy.get('[data-testid="login-button"]').should('exist');
    
    // Входим в систему
    cy.get('[data-testid="login-button"]').click();
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
    
    // Проверяем, что пользователь авторизован
    cy.get('[data-testid="user-menu"]').should('contain', username);
  });
});

// Тест создания и выполнения привычки
describe('Привычки', () => {
  beforeEach(() => {
    // Авторизуемся перед каждым тестом
    cy.login('testuser', 'password123');
  });
  
  it('должен создавать новую привычку и отмечать ее выполнение', () => {
    // Переходим на страницу привычек
    cy.visit('/habits');
    
    // Нажимаем на кнопку "Создать привычку"
    cy.get('[data-testid="create-habit-button"]').click();
    
    // Заполняем форму создания привычки
    cy.get('input[name="name"]').type('Тестовая привычка');
    cy.get('textarea[name="description"]').type('Описание тестовой привычки');
    cy.get('input[name="goal"]').clear().type('10');
    cy.get('button[type="submit"]').click();
    
    // Проверяем, что привычка создана
    cy.get('[data-testid="habit-card"]').should('contain', 'Тестовая привычка');
    cy.get('[data-testid="habit-card"]').should('contain', '0/10');
    
    // Отмечаем выполнение привычки
    cy.get('[data-testid="complete-habit-button"]').click();
    
    // Проверяем, что прогресс обновился
    cy.get('[data-testid="habit-card"]').should('contain', '1/10');
    
    // Проверяем, что опыт пользователя увеличился
    cy.get('[data-testid="user-xp"]').should('not.contain', '0');
  });
});
```

## Тестирование производительности

Для тестирования производительности используется инструмент Lighthouse, который позволяет оценить скорость загрузки страниц, доступность, SEO и другие метрики.

```javascript
// Тест производительности главной страницы
describe('Производительность', () => {
  it('должен соответствовать требованиям производительности', () => {
    cy.visit('/');
    
    cy.lighthouse({
      performance: 90,
      accessibility: 90,
      'best-practices': 90,
      seo: 90,
      pwa: 50
    });
  });
});
```

## Тестирование безопасности

Для тестирования безопасности используются следующие инструменты:

- **OWASP ZAP** - для сканирования уязвимостей
- **npm audit** - для проверки зависимостей на наличие уязвимостей

```bash
# Запуск сканирования уязвимостей
npm run security:scan

# Проверка зависимостей на наличие уязвимостей
npm audit
```

## Непрерывная интеграция (CI)

Для непрерывной интеграции используется GitHub Actions. При каждом пуше в репозиторий запускаются следующие тесты:

1. Линтинг кода
2. Модульные тесты
3. Интеграционные тесты
4. E2E-тесты
5. Проверка зависимостей на наличие уязвимостей

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Lint
      run: npm run lint
    
    - name: Unit tests
      run: npm run test:unit
    
    - name: Integration tests
      run: npm run test:integration
    
    - name: E2E tests
      run: npm run test:e2e
    
    - name: Security audit
      run: npm audit
```

## Покрытие кода тестами

Для отслеживания покрытия кода тестами используется инструмент Istanbul. Целевое покрытие кода тестами - не менее 80%.

```bash
# Запуск тестов с отчетом о покрытии
npm run test:coverage
```

## Мониторинг и отчетность

Для мониторинга и отчетности используются следующие инструменты:

- **Jest** - для генерации отчетов о результатах тестирования
- **Cypress Dashboard** - для мониторинга E2E-тестов
- **Sentry** - для отслеживания ошибок в продакшене

## Заключение

Стратегия тестирования проекта "Геймификация жизни v0.2" основана на методологии TDD и включает в себя различные уровни тестирования: модульное, интеграционное и E2E. Также проводится тестирование производительности и безопасности. Для обеспечения качества кода используется непрерывная интеграция и отслеживание покрытия кода тестами. 