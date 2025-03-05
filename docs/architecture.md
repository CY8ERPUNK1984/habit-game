# Архитектура проекта "Геймификация жизни v0.2"

## Общая архитектура системы

Проект "Геймификация жизни" построен на основе клиент-серверной архитектуры с использованием современных технологий и подходов к разработке.

```mermaid
graph TD
    Client[Клиент - Next.js] --> API[API - Express]
    API --> DB[(База данных - MongoDB)]
    
    subgraph Клиентская часть
        Client --> Components[React компоненты]
        Client --> Pages[Страницы]
        Client --> State[Управление состоянием]
        Client --> Styles[Стили - Tailwind CSS]
    end
    
    subgraph Серверная часть
        API --> Controllers[Контроллеры]
        API --> Models[Модели данных]
        API --> Routes[Маршруты]
        API --> Middleware[Middleware]
    end
    
    subgraph База данных
        DB --> Users[Пользователи]
        DB --> Habits[Привычки]
        DB --> Tasks[Задачи]
        DB --> Achievements[Достижения]
    end
```

## Архитектура фронтенда

Фронтенд построен на основе Next.js с использованием React и Tailwind CSS.

```mermaid
graph TD
    App[App] --> Layout[Layout]
    Layout --> Header[Header]
    Layout --> Main[Main Content]
    Layout --> Footer[Footer]
    
    Main --> Dashboard[Dashboard]
    Main --> Achievements[Achievements]
    Main --> Statistics[Statistics]
    Main --> Settings[Settings]
    Main --> Tasks[Tasks]
    
    Dashboard --> HabitCard[HabitCard]
    Dashboard --> LevelInfo[LevelInfo]
    Dashboard --> ProgressBar[ProgressBar]
    
    Tasks --> TaskList[TaskList]
    Tasks --> TaskItem[TaskItem]
    Tasks --> TaskForm[TaskForm]
    
    Achievements --> AchievementList[AchievementList]
    Achievements --> AchievementItem[AchievementItem]
    
    Statistics --> StatCard[StatCard]
    Statistics --> Chart[Chart]
    
    Settings --> SettingsForm[SettingsForm]
    
    subgraph Состояние приложения
        Context[Context API]
        Context --> UserContext[UserContext]
        Context --> HabitsContext[HabitsContext]
        Context --> TasksContext[TasksContext]
        Context --> AchievementsContext[AchievementsContext]
    end
```

## Архитектура бэкенда

Бэкенд построен на основе Node.js и Express с использованием MongoDB в качестве базы данных.

```mermaid
graph TD
    Server[Server] --> Routes[Routes]
    Server --> Middleware[Middleware]
    Server --> Database[Database Connection]
    
    Routes --> UserRoutes[User Routes]
    Routes --> HabitRoutes[Habit Routes]
    Routes --> TaskRoutes[Task Routes]
    Routes --> AchievementRoutes[Achievement Routes]
    Routes --> StatisticsRoutes[Statistics Routes]
    
    UserRoutes --> UserController[User Controller]
    HabitRoutes --> HabitController[Habit Controller]
    TaskRoutes --> TaskController[Task Controller]
    AchievementRoutes --> AchievementController[Achievement Controller]
    StatisticsRoutes --> StatisticsController[Statistics Controller]
    
    UserController --> UserModel[User Model]
    HabitController --> HabitModel[Habit Model]
    TaskController --> TaskModel[Task Model]
    AchievementController --> AchievementModel[Achievement Model]
    StatisticsController --> UserModel
    StatisticsController --> HabitModel
    StatisticsController --> TaskModel
    
    Middleware --> Auth[Authentication]
    Middleware --> Validation[Validation]
    Middleware --> ErrorHandling[Error Handling]
    
    Database --> MongoDB[(MongoDB)]
```

## Схема базы данных

База данных MongoDB содержит следующие коллекции:

```mermaid
erDiagram
    USER {
        string _id
        string username
        string password
        int level
        int xp
        float startingWeight
        float currentWeight
        float targetWeight
        int daysWithoutGames
        int longestStreakGames
        int projectsCreated
        int daysCoding
        int cyclingWorkouts
        int workTasks
        array achievements
        boolean notifications
        date createdAt
        date updatedAt
    }
    
    HABIT {
        string _id
        string userId
        string name
        string description
        int progress
        int goal
        array history
        date createdAt
        date updatedAt
    }
    
    TASK {
        string _id
        string userId
        string title
        string description
        string size
        boolean completed
        date completedAt
        date createdAt
        date updatedAt
    }
    
    ACHIEVEMENT {
        string _id
        string userId
        string name
        string description
        string icon
        boolean unlocked
        date unlockedAt
        date createdAt
    }
    
    USER ||--o{ HABIT : has
    USER ||--o{ TASK : has
    USER ||--o{ ACHIEVEMENT : has
```

## Процесс аутентификации

Процесс аутентификации пользователя в системе:

```mermaid
sequenceDiagram
    participant Client as Клиент
    participant API as API
    participant DB as База данных
    
    Client->>API: POST /api/auth/login (username, password)
    API->>DB: Поиск пользователя по username
    DB-->>API: Данные пользователя
    
    alt Пользователь не найден
        API-->>Client: 404 Not Found
    else Пользователь найден
        API->>API: Проверка пароля
        
        alt Пароль неверный
            API-->>Client: 401 Unauthorized
        else Пароль верный
            API->>API: Генерация JWT токена
            API-->>Client: 200 OK, JWT токен
            Client->>Client: Сохранение токена
        end
    end
    
    Client->>API: GET /api/user (с JWT токеном)
    API->>API: Проверка JWT токена
    
    alt Токен неверный
        API-->>Client: 401 Unauthorized
    else Токен верный
        API->>DB: Получение данных пользователя
        DB-->>API: Данные пользователя
        API-->>Client: 200 OK, данные пользователя
    end
```

## Процесс выполнения привычки

Процесс отметки выполнения привычки и получения опыта:

```mermaid
sequenceDiagram
    participant Client as Клиент
    participant API as API
    participant DB as База данных
    
    Client->>API: POST /api/habits/:id/complete
    API->>API: Проверка JWT токена
    
    alt Токен неверный
        API-->>Client: 401 Unauthorized
    else Токен верный
        API->>DB: Проверка существования привычки
        
        alt Привычка не найдена
            API-->>Client: 404 Not Found
        else Привычка найдена
            API->>DB: Проверка, отмечена ли привычка сегодня
            
            alt Привычка уже отмечена
                API-->>Client: 400 Bad Request
            else Привычка не отмечена
                API->>DB: Обновление статуса привычки
                API->>DB: Получение данных пользователя
                API->>API: Расчет опыта
                API->>DB: Обновление опыта пользователя
                
                alt Достаточно опыта для повышения уровня
                    API->>API: Расчет нового уровня
                    API->>DB: Обновление уровня пользователя
                end
                
                API->>API: Проверка условий достижений
                
                alt Условия достижения выполнены
                    API->>DB: Добавление достижения
                    API->>API: Расчет дополнительного опыта
                    API->>DB: Обновление опыта пользователя
                end
                
                DB-->>API: Обновленные данные
                API-->>Client: 200 OK, обновленные данные
            end
        end
    end
```

## Процесс получения достижения

Процесс получения достижения пользователем:

```mermaid
sequenceDiagram
    participant Client as Клиент
    participant API as API
    participant DB as База данных
    
    Client->>API: POST /api/habits/:id/complete или POST /api/tasks/:id/complete
    API->>API: Проверка JWT токена
    
    alt Токен неверный
        API-->>Client: 401 Unauthorized
    else Токен верный
        API->>DB: Обновление статуса привычки/задачи
        API->>DB: Получение данных пользователя
        API->>API: Проверка условий достижений
        
        alt Условия достижения выполнены
            API->>DB: Проверка, получено ли достижение
            
            alt Достижение уже получено
                API->>API: Пропуск
            else Достижение не получено
                API->>DB: Добавление достижения
                API->>API: Расчет дополнительного опыта
                API->>DB: Обновление опыта пользователя
                
                alt Достаточно опыта для повышения уровня
                    API->>API: Расчет нового уровня
                    API->>DB: Обновление уровня пользователя
                end
                
                DB-->>API: Обновленные данные
                API-->>Client: 200 OK, обновленные данные, уведомление о достижении
            end
        else Условия достижения не выполнены
            API-->>Client: 200 OK, обновленные данные
        end
    end
```

## Архитектура тестирования

Архитектура тестирования проекта:

```mermaid
graph TD
    Tests[Тесты] --> UnitTests[Unit-тесты]
    Tests --> IntegrationTests[Интеграционные тесты]
    Tests --> E2ETests[End-to-end тесты]
    
    UnitTests --> FrontendUnitTests[Frontend Unit-тесты]
    UnitTests --> BackendUnitTests[Backend Unit-тесты]
    
    FrontendUnitTests --> ComponentTests[Тесты компонентов]
    FrontendUnitTests --> HookTests[Тесты хуков]
    FrontendUnitTests --> UtilTests[Тесты утилит]
    
    BackendUnitTests --> ControllerTests[Тесты контроллеров]
    BackendUnitTests --> ModelTests[Тесты моделей]
    BackendUnitTests --> ServiceTests[Тесты сервисов]
    
    IntegrationTests --> APITests[Тесты API]
    IntegrationTests --> DatabaseTests[Тесты базы данных]
    
    E2ETests --> UserFlowTests[Тесты пользовательских сценариев]
    E2ETests --> PerformanceTests[Тесты производительности]
    E2ETests --> SecurityTests[Тесты безопасности]
```

## Процесс CI/CD

Процесс непрерывной интеграции и доставки:

```mermaid
graph TD
    Developer[Разработчик] -->|Push| GitHub[GitHub]
    GitHub -->|Trigger| Actions[GitHub Actions]
    
    subgraph CI
        Actions -->|Run| Lint[Линтинг]
        Actions -->|Run| UnitTests[Unit-тесты]
        Actions -->|Run| IntegrationTests[Интеграционные тесты]
        Actions -->|Run| Build[Сборка]
    end
    
    subgraph CD
        Build -->|Deploy to| Staging[Staging]
        Staging -->|Manual approval| Production[Production]
    end
    
    Production -->|Frontend| Vercel[Vercel]
    Production -->|Backend| Server[Server]
    Production -->|Database| MongoDB[MongoDB Atlas]
```

## Архитектура мониторинга

Архитектура мониторинга проекта:

```mermaid
graph TD
    App[Приложение] -->|Логи и ошибки| Sentry[Sentry]
    App -->|Метрики| Prometheus[Prometheus]
    
    Prometheus -->|Визуализация| Grafana[Grafana]
    
    subgraph Мониторинг
        Sentry -->|Алерты| Slack[Slack]
        Grafana -->|Алерты| Slack
    end
    
    subgraph Анализ
        Sentry -->|Анализ ошибок| ErrorAnalysis[Анализ ошибок]
        Grafana -->|Анализ производительности| PerformanceAnalysis[Анализ производительности]
    end
``` 