# Технологический стек

В этом документе описан технологический стек проекта "Геймификация жизни v0.2", включая используемые языки программирования, фреймворки, библиотеки и инструменты.

## Общая архитектура

Проект "Геймификация жизни" построен на основе клиент-серверной архитектуры:

- **Frontend**: Next.js (React) приложение
- **Backend**: Node.js + Express API
- **База данных**: MongoDB

## Frontend

### Основные технологии

- **Next.js** (v14.0.0) - React-фреймворк для разработки веб-приложений
- **React** (v18.2.0) - JavaScript-библиотека для создания пользовательских интерфейсов
- **TypeScript** (v5.2.2) - Типизированный JavaScript
- **Tailwind CSS** (v3.3.0) - Утилитарный CSS-фреймворк

### Управление состоянием

- **React Context API** - Для управления глобальным состоянием приложения
- **React Query** (v5.0.0) - Для управления серверным состоянием и кэшированием

### UI-компоненты

- **Headless UI** (v1.7.0) - Доступные UI-компоненты без стилей
- **Framer Motion** (v10.16.0) - Библиотека для анимаций
- **React Hook Form** (v7.47.0) - Библиотека для работы с формами
- **Zod** (v3.22.0) - Библиотека для валидации данных

### Визуализация данных

- **Chart.js** (v4.4.0) - Библиотека для создания графиков
- **React Chartjs 2** (v5.2.0) - React-обертка для Chart.js

### Утилиты

- **date-fns** (v2.30.0) - Библиотека для работы с датами
- **axios** (v1.5.0) - HTTP-клиент для выполнения запросов к API
- **js-cookie** (v3.0.5) - Библиотека для работы с cookies
- **clsx** (v2.0.0) - Утилита для условного объединения классов

### Тестирование

- **Jest** (v29.7.0) - JavaScript-фреймворк для тестирования
- **React Testing Library** (v14.0.0) - Библиотека для тестирования React-компонентов
- **Cypress** (v13.3.0) - Фреймворк для E2E-тестирования

### Линтинг и форматирование

- **ESLint** (v8.50.0) - Линтер для JavaScript и TypeScript
- **Prettier** (v3.0.3) - Инструмент для форматирования кода

## Backend

### Основные технологии

- **Node.js** (v18.18.0) - JavaScript-среда выполнения
- **Express** (v4.18.2) - Веб-фреймворк для Node.js
- **TypeScript** (v5.2.2) - Типизированный JavaScript
- **MongoDB** (v6.1.0) - NoSQL база данных
- **Mongoose** (v7.5.3) - ODM для MongoDB

### Аутентификация и авторизация

- **jsonwebtoken** (v9.0.2) - Библиотека для работы с JWT
- **bcrypt** (v5.1.1) - Библиотека для хеширования паролей
- **cookie-parser** (v1.4.6) - Middleware для работы с cookies

### Валидация

- **express-validator** (v7.0.1) - Middleware для валидации запросов
- **joi** (v17.10.2) - Библиотека для валидации данных

### Логирование и мониторинг

- **winston** (v3.10.0) - Библиотека для логирования
- **morgan** (v1.10.0) - HTTP-логгер для Express
- **Sentry** (v7.73.0) - Платформа для мониторинга ошибок

### Безопасность

- **helmet** (v7.0.0) - Middleware для защиты Express-приложений
- **cors** (v2.8.5) - Middleware для настройки CORS
- **rate-limiter-flexible** (v3.0.0) - Middleware для ограничения запросов

### Тестирование

- **Jest** (v29.7.0) - JavaScript-фреймворк для тестирования
- **Supertest** (v6.3.3) - Библиотека для тестирования HTTP-запросов

### Линтинг и форматирование

- **ESLint** (v8.50.0) - Линтер для JavaScript и TypeScript
- **Prettier** (v3.0.3) - Инструмент для форматирования кода

## Инфраструктура

### Контейнеризация и оркестрация

- **Docker** (v24.0.0) - Платформа для контейнеризации приложений
- **Docker Compose** (v2.20.0) - Инструмент для определения и запуска многоконтейнерных приложений

### CI/CD

- **GitHub Actions** - Платформа для непрерывной интеграции и доставки

### Хостинг

- **Vercel** - Платформа для хостинга frontend-приложений
- **Heroku** - Платформа для хостинга backend-приложений
- **MongoDB Atlas** - Облачная база данных MongoDB

## Инструменты разработки

### IDE и редакторы

- **Visual Studio Code** - Редактор кода
- **WebStorm** - IDE для JavaScript и TypeScript

### Управление зависимостями

- **npm** (v9.8.0) - Менеджер пакетов для Node.js
- **pnpm** (v8.7.0) - Быстрый и эффективный менеджер пакетов

### Управление версиями

- **Git** - Система контроля версий
- **GitHub** - Платформа для хостинга репозиториев

### Документация

- **Markdown** - Язык разметки для документации
- **Mermaid.js** - Библиотека для создания диаграмм в Markdown

## Требования к окружению разработки

### Минимальные требования

- **Node.js**: v18.0.0 или выше
- **npm**: v8.0.0 или выше
- **MongoDB**: v5.0.0 или выше
- **Git**: v2.30.0 или выше

### Рекомендуемые требования

- **Node.js**: v18.18.0
- **npm**: v9.8.0
- **MongoDB**: v6.0.0
- **Git**: v2.40.0
- **Docker**: v24.0.0
- **Docker Compose**: v2.20.0

## Структура проекта

```
habit-game/
├── docs/                      # Документация проекта
├── src/                       # Исходный код
│   ├── frontend/              # Frontend-приложение (Next.js)
│   │   ├── app/               # App Router (Next.js 13+)
│   │   ├── components/        # React-компоненты
│   │   ├── contexts/          # React Context API
│   │   ├── hooks/             # Пользовательские хуки
│   │   ├── lib/               # Утилиты и вспомогательные функции
│   │   ├── public/            # Статические файлы
│   │   ├── styles/            # Глобальные стили
│   │   ├── types/             # TypeScript типы
│   │   ├── .env.local         # Локальные переменные окружения
│   │   ├── .eslintrc.js       # Конфигурация ESLint
│   │   ├── next.config.js     # Конфигурация Next.js
│   │   ├── package.json       # Зависимости и скрипты
│   │   ├── tailwind.config.js # Конфигурация Tailwind CSS
│   │   └── tsconfig.json      # Конфигурация TypeScript
│   ├── backend/               # Backend-приложение (Express)
│   │   ├── config/            # Конфигурация приложения
│   │   ├── controllers/       # Контроллеры
│   │   ├── middleware/        # Middleware
│   │   ├── models/            # Mongoose-модели
│   │   ├── routes/            # Express-маршруты
│   │   ├── services/          # Бизнес-логика
│   │   ├── utils/             # Утилиты и вспомогательные функции
│   │   ├── .env               # Переменные окружения
│   │   ├── .eslintrc.js       # Конфигурация ESLint
│   │   ├── app.ts             # Основной файл приложения
│   │   ├── package.json       # Зависимости и скрипты
│   │   └── tsconfig.json      # Конфигурация TypeScript
│   └── tests/                 # Тесты
│       ├── e2e/               # E2E-тесты (Cypress)
│       ├── integration/       # Интеграционные тесты
│       └── unit/              # Модульные тесты
├── .github/                   # GitHub Actions
│   └── workflows/             # CI/CD конфигурация
├── docker-compose.yml         # Docker Compose конфигурация
├── Dockerfile.frontend        # Dockerfile для frontend
├── Dockerfile.backend         # Dockerfile для backend
├── .gitignore                 # Git ignore файл
├── README.md                  # Основной README файл
└── package.json               # Корневой package.json
```

## Установка и запуск

### Установка зависимостей

```bash
# Установка зависимостей для frontend
cd src/frontend
npm install

# Установка зависимостей для backend
cd src/backend
npm install
```

### Запуск в режиме разработки

```bash
# Запуск frontend
cd src/frontend
npm run dev

# Запуск backend
cd src/backend
npm run dev
```

### Запуск с использованием Docker

```bash
# Запуск всего приложения
docker-compose up

# Запуск только frontend
docker-compose up frontend

# Запуск только backend
docker-compose up backend
```

### Запуск тестов

```bash
# Запуск модульных тестов
npm run test:unit

# Запуск интеграционных тестов
npm run test:integration

# Запуск E2E-тестов
npm run test:e2e

# Запуск всех тестов
npm run test
```

## Переменные окружения

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SENTRY_DSN=https://example@sentry.io/123
```

### Backend (.env)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/habit-game
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
NODE_ENV=development
SENTRY_DSN=https://example@sentry.io/123
```

## Заключение

Технологический стек проекта "Геймификация жизни v0.2" основан на современных технологиях и инструментах, которые обеспечивают высокую производительность, масштабируемость и удобство разработки. Проект следует лучшим практикам разработки веб-приложений и использует типизацию для обеспечения надежности кода. 