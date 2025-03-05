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
        DB --> UserAchievements[Пользовательские достижения]
    end
```

## Структура проекта

Проект организован как монорепозиторий с использованием workspaces в npm, что позволяет более гибко управлять зависимостями и обеспечивает удобную разработку как фронтенда, так и бэкенда.

```mermaid
graph TD
    Root[/habit-game/] --> PackageJson[package.json]
    Root --> Src[/src/]
    Root --> Docs[/docs/]
    Root --> Tests[/tests/]
    Root --> Config[Конфигурационные файлы]
    
    Src --> Frontend[/frontend/]
    Src --> Backend[/backend/]
    
    Frontend --> FComponents[/components/]
    Frontend --> FApp[/app/]
    Frontend --> FContexts[/contexts/]
    Frontend --> FHooks[/hooks/]
    Frontend --> FLib[/lib/]
    Frontend --> FPublic[/public/]
    Frontend --> FStyles[/styles/]
    Frontend --> FTypes[/types/]
    
    Backend --> BConfig[/config/]
    Backend --> BControllers[/controllers/]
    Backend --> BMiddleware[/middleware/]
    Backend --> BModels[/models/]
    Backend --> BRoutes[/routes/]
    Backend --> BServices[/services/]
    Backend --> BUtils[/utils/]
    Backend --> BTests[/tests/]
    
    Docs --> Architecture[architecture.md]
    Docs --> ApiDoc[api-documentation.md]
    Docs --> TestingStrategy[testing-strategy.md]
    Docs --> UiDesign[ui-design.md]
    Docs --> DataModels[data-models.md]
    Docs --> DevProcess[development-process.md]
    Docs --> TechStack[tech-stack.md]
    Docs --> CiCd[ci-cd.md]
    
    Config --> GitHubWorkflows[/.github/workflows/]
    Config --> Docker[Dockerfile]
    Config --> DockerCompose[docker-compose.yml]
    Config --> Jest[jest.config.js]
    Config --> Eslint[.eslintrc.js]
    Config --> Tsconfig[tsconfig.json]
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

### Детальная структура фронтенда

```mermaid
graph TD
    subgraph Next.js App Router
        RootLayout[RootLayout] --> AppPages[App Pages]
        AppPages --> HomePage[HomePage]
        AppPages --> DashboardPage[DashboardPage]
        AppPages --> HabitsPage[HabitsPage]
        AppPages --> TasksPage[TasksPage]
        AppPages --> AchievementsPage[AchievementsPage]
        AppPages --> ProfilePage[ProfilePage]
    end
    
    subgraph Components
        UI[UI Components] --> Header[Header]
        UI --> Footer[Footer]
        UI --> Button[Button]
        UI --> Card[Card]
        UI --> Input[Input]
        UI --> Modal[Modal]
        
        Feature[Feature Components] --> HabitForm[HabitForm]
        Feature --> HabitList[HabitList]
        Feature --> TaskForm[TaskForm]
        Feature --> TaskList[TaskList]
        Feature --> AchievementCard[AchievementCard]
        Feature --> LevelProgress[LevelProgress]
    end
    
    subgraph State Management
        Contexts[React Contexts] --> AuthContext[AuthContext]
        Contexts --> ThemeContext[ThemeContext]
        Contexts --> NotificationContext[NotificationContext]
        
        Hooks[Custom Hooks] --> useAuth[useAuth]
        Hooks --> useHabits[useHabits]
        Hooks --> useTasks[useTasks]
        Hooks --> useAchievements[useAchievements]
        Hooks --> useStats[useStats]
    end
    
    subgraph API Communication
        ApiServices[API Services] --> AuthService[AuthService]
        ApiServices --> HabitService[HabitService]
        ApiServices --> TaskService[TaskService]
        ApiServices --> UserService[UserService]
        ApiServices --> AchievementService[AchievementService]
        
        FetchWrapper[Fetch Wrapper] --> ApiInterceptor[API Interceptor]
        FetchWrapper --> ErrorHandler[Error Handler]
        
        AuthService --> FetchWrapper
        HabitService --> FetchWrapper
        TaskService --> FetchWrapper
        UserService --> FetchWrapper
        AchievementService --> FetchWrapper
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

### Детальная структура бэкенда

```mermaid
graph TD
    subgraph Core Infrastructure
        App[Express App] --> ConfigLoader[Config Loader]
        App --> DatabaseConnector[Database Connector]
        App --> RoutesLoader[Routes Loader]
        App --> MiddlewareLoader[Middleware Loader]
        
        ConfigLoader --> EnvConfig[Environment Config]
        ConfigLoader --> LoggerConfig[Logger Config]
        
        DatabaseConnector --> MongooseConnection[Mongoose Connection]
        DatabaseConnector --> Seeder[Database Seeder]
    end
    
    subgraph API Layers
        RoutesLoader --> AuthRoutes[Auth Routes]
        RoutesLoader --> UserRoutes[User Routes]
        RoutesLoader --> HabitRoutes[Habit Routes]
        RoutesLoader --> TaskRoutes[Task Routes]
        RoutesLoader --> AchievementRoutes[Achievement Routes]
        
        AuthRoutes --> AuthController[Auth Controller]
        UserRoutes --> UserController[User Controller]
        HabitRoutes --> HabitController[Habit Controller]
        TaskRoutes --> TaskController[Task Controller]
        AchievementRoutes --> AchievementController[Achievement Controller]
        
        AuthController --> AuthService[Auth Service]
        UserController --> UserService[User Service]
        HabitController --> HabitService[Habit Service]
        TaskController --> TaskService[Task Service]
        AchievementController --> AchievementService[Achievement Service]
        
        AuthService --> UserModel[User Model]
        UserService --> UserModel
        HabitService --> HabitModel[Habit Model]
        TaskService --> TaskModel[Task Model]
        AchievementService --> AchievementModel[Achievement Model]
        AchievementService --> UserAchievementModel[UserAchievement Model]
    end
    
    subgraph Middleware
        MiddlewareLoader --> AuthMiddleware[Auth Middleware]
        MiddlewareLoader --> ErrorMiddleware[Error Middleware]
        MiddlewareLoader --> ValidationMiddleware[Validation Middleware]
        MiddlewareLoader --> LoggingMiddleware[Logging Middleware]
        
        AuthMiddleware --> JwtService[JWT Service]
        ValidationMiddleware --> JoiValidator[Joi Validator]
        LoggingMiddleware --> LoggerService[Logger Service]
    end
    
    subgraph Utilities
        JwtService --> Crypto[Crypto Utilities]
        LoggerService --> Winston[Winston Logger]
        
        Utils[Utilities] --> DateUtils[Date Utilities]
        Utils --> StringUtils[String Utilities]
        Utils --> ObjectUtils[Object Utilities]
    end
```

## Схема базы данных

База данных MongoDB содержит следующие коллекции:

```mermaid
erDiagram
    USER {
        string _id PK
        string name
        string email
        string password
        string avatar
        int level
        int experience
        date createdAt
        date updatedAt
    }
    
    HABIT {
        string _id PK
        string title
        string description
        string user FK
        enum frequency
        array customFrequencyDays
        enum category
        enum priority
        int streak
        boolean completedToday
        array completionHistory
        int experiencePoints
        date startDate
        date targetEndDate
        time reminderTime
        date createdAt
        date updatedAt
    }
    
    TASK {
        string _id PK
        string title
        string description
        string user FK
        enum size
        enum status
        int experiencePoints
        date dueDate
        date completedDate
        array tags
        date createdAt
        date updatedAt
    }
    
    ACHIEVEMENT {
        string _id PK
        string title
        string description
        enum type
        string icon
        int experienceReward
        int requiredValue
        boolean isVisible
        boolean isGlobal
        date createdAt
        date updatedAt
    }
    
    USER_ACHIEVEMENT {
        string _id PK
        string user FK
        string achievement FK
        date unlockedAt
        date createdAt
        date updatedAt
    }
    
    USER ||--o{ HABIT : creates
    USER ||--o{ TASK : creates
    USER ||--o{ USER_ACHIEVEMENT : earns
    ACHIEVEMENT ||--o{ USER_ACHIEVEMENT : awarded_to
```

## Процесс аутентификации

Процесс аутентификации пользователя в системе:

```mermaid
sequenceDiagram
    participant Client as Клиент
    participant API as API
    participant DB as База данных
    
    Client->>API: POST /api/auth/login (email, password)
    API->>DB: Поиск пользователя по email
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

### Детальная архитектура TDD процесса

```mermaid
graph LR
    subgraph TDD Cycle
        WriteTest[1. Написать тест] --> RunTest[2. Запустить тест]
        RunTest --> FailedTest{Тест провален?}
        FailedTest -->|Да| WriteCode[3. Написать код]
        FailedTest -->|Нет| RefactorTest[Уточнить требования и переписать тест]
        WriteCode --> RunTestAgain[4. Запустить тест снова]
        RunTestAgain --> PassedTest{Тест пройден?}
        PassedTest -->|Да| Refactor[5. Рефакторинг]
        PassedTest -->|Нет| FixCode[Исправить код]
        FixCode --> RunTestAgain
        Refactor --> NextFeature[6. Следующая функция]
        NextFeature --> WriteTest
    end
    
    subgraph Testing Levels
        Unit[Unit Testing] --> Component[Component Testing]
        Component --> Integration[Integration Testing]
        Integration --> System[System Testing]
        System --> E2E[End-to-End Testing]
    end
    
    subgraph Test Types
        Functional[Functional Tests]
        Performance[Performance Tests]
        Security[Security Tests]
        Usability[Usability Tests]
        Regression[Regression Tests]
    end
    
    Unit --> Functional
    Component --> Functional
    Integration --> Functional
    System --> Functional
    System --> Performance
    System --> Security
    E2E --> Usability
    E2E --> Regression
```

## Процесс CI/CD

Процесс непрерывной интеграции и доставки:

```mermaid
graph TD
    Developer[Разработчик] -->|Push| GitHub[GitHub]
    GitHub -->|Trigger| Actions[GitHub Actions]
    
    subgraph CI
        Actions -->|Run| Lint[Линтинг]
        Lint -->|Success| UnitTests[Unit-тесты]
        UnitTests -->|Success| IntegrationTests[Интеграционные тесты]
        IntegrationTests -->|Success| BackendTests[Backend Tests]
        IntegrationTests -->|Success| FrontendTests[Frontend Tests]
        BackendTests -->|Success| E2ETests[E2E Tests]
        FrontendTests -->|Success| E2ETests
        E2ETests -->|Success| SecurityAudit[Security Audit]
        SecurityAudit -->|Success| Build[Сборка]
    end
    
    subgraph CD
        Build -->|Deploy to| Staging[Staging]
        Staging -->|Tests Pass| Production[Production]
    end
    
    Production -->|Frontend| Vercel[Vercel]
    Production -->|Backend| Heroku[Heroku]
    Production -->|Database| MongoDB[MongoDB Atlas]
    
    subgraph Notifications
        Vercel -->|Deployment Status| Slack[Slack]
        Heroku -->|Deployment Status| Slack
        Slack -->|Alert| Team[Команда]
        Vercel -->|Deployment Status| Telegram[Telegram]
        Heroku -->|Deployment Status| Telegram
        Telegram -->|Alert| Team
    end
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

## Архитектура развертывания

```mermaid
graph TD
    subgraph Development
        LocalDev[Локальная разработка] --> Docker[Docker]
        LocalDev --> NPM[NPM Scripts]
    end
    
    subgraph Staging
        GitHubActions[GitHub Actions] --> VercelPreview[Vercel Preview]
        GitHubActions --> HerokuStaging[Heroku Staging]
        GitHubActions --> MongoDBAtlasDev[MongoDB Atlas Dev]
    end
    
    subgraph Production
        MainBranch[Main Branch] --> VercelProd[Vercel Production]
        MainBranch --> HerokuProd[Heroku Production]
        MainBranch --> MongoDBAtlasProd[MongoDB Atlas Prod]
    end
    
    subgraph Scaling
        HerokuProd --> AutoScaling[Auto Scaling]
        VercelProd --> CDN[Content Delivery Network]
        MongoDBAtlasProd --> Sharding[Database Sharding]
        MongoDBAtlasProd --> Replication[Database Replication]
    end
    
    subgraph Security
        VercelProd --> SSL[SSL/TLS]
        HerokuProd --> Firewall[Firewall]
        MongoDBAtlasProd --> NetworkIsolation[Network Isolation]
        SSL --> WAF[Web Application Firewall]
        Firewall --> DDOS[DDoS Protection]
    end
``` 