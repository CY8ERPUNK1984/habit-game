# Документация API

## Общая информация

API проекта "Геймификация жизни" построено на основе REST архитектуры и использует JSON для передачи данных. Все запросы к API должны содержать заголовок `Authorization` с JWT токеном для аутентификации пользователя.

### Базовый URL

```
https://api.habit-game.com/api
```

### Формат ответа

Все ответы API имеют следующий формат:

```json
{
  "success": true,
  "data": { ... },
  "message": "Операция выполнена успешно"
}
```

В случае ошибки:

```json
{
  "success": false,
  "error": {
    "code": 400,
    "message": "Описание ошибки"
  }
}
```

### Коды ответов

- `200 OK` - Запрос выполнен успешно
- `201 Created` - Ресурс успешно создан
- `400 Bad Request` - Ошибка в запросе
- `401 Unauthorized` - Ошибка аутентификации
- `403 Forbidden` - Доступ запрещен
- `404 Not Found` - Ресурс не найден
- `500 Internal Server Error` - Внутренняя ошибка сервера

## Аутентификация

### Регистрация пользователя

```
POST /auth/register
```

#### Параметры запроса

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| username | string | Да | Имя пользователя |
| password | string | Да | Пароль пользователя |

#### Пример запроса

```json
{
  "username": "testuser",
  "password": "password123"
}
```

#### Пример ответа

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "60d21b4667d0d8992e610c85",
      "username": "testuser",
      "level": 1,
      "xp": 0,
      "startingWeight": 0,
      "currentWeight": 0,
      "targetWeight": 65,
      "daysWithoutGames": 0,
      "longestStreakGames": 0,
      "projectsCreated": 0,
      "daysCoding": 0,
      "cyclingWorkouts": 0,
      "workTasks": 0,
      "achievements": [],
      "notifications": true,
      "createdAt": "2023-06-22T10:00:00.000Z",
      "updatedAt": "2023-06-22T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Пользователь успешно зарегистрирован"
}
```

### Вход пользователя

```
POST /auth/login
```

#### Параметры запроса

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| username | string | Да | Имя пользователя |
| password | string | Да | Пароль пользователя |

#### Пример запроса

```json
{
  "username": "testuser",
  "password": "password123"
}
```

#### Пример ответа

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "60d21b4667d0d8992e610c85",
      "username": "testuser",
      "level": 1,
      "xp": 0,
      "startingWeight": 0,
      "currentWeight": 0,
      "targetWeight": 65,
      "daysWithoutGames": 0,
      "longestStreakGames": 0,
      "projectsCreated": 0,
      "daysCoding": 0,
      "cyclingWorkouts": 0,
      "workTasks": 0,
      "achievements": [],
      "notifications": true,
      "createdAt": "2023-06-22T10:00:00.000Z",
      "updatedAt": "2023-06-22T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Вход выполнен успешно"
}
```

## Пользователи

### Получение данных пользователя

```
GET /user
```

#### Заголовки запроса

| Заголовок | Значение |
|-----------|----------|
| Authorization | Bearer {token} |

#### Пример ответа

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "60d21b4667d0d8992e610c85",
      "username": "testuser",
      "level": 1,
      "xp": 0,
      "startingWeight": 0,
      "currentWeight": 0,
      "targetWeight": 65,
      "daysWithoutGames": 0,
      "longestStreakGames": 0,
      "projectsCreated": 0,
      "daysCoding": 0,
      "cyclingWorkouts": 0,
      "workTasks": 0,
      "achievements": [],
      "notifications": true,
      "createdAt": "2023-06-22T10:00:00.000Z",
      "updatedAt": "2023-06-22T10:00:00.000Z"
    }
  },
  "message": "Данные пользователя получены успешно"
}
```

### Обновление данных пользователя

```
PUT /user
```

#### Заголовки запроса

| Заголовок | Значение |
|-----------|----------|
| Authorization | Bearer {token} |

#### Параметры запроса

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| startingWeight | number | Нет | Начальный вес пользователя |
| currentWeight | number | Нет | Текущий вес пользователя |
| targetWeight | number | Нет | Целевой вес пользователя |
| notifications | boolean | Нет | Включены ли уведомления |

#### Пример запроса

```json
{
  "startingWeight": 80,
  "currentWeight": 78,
  "targetWeight": 70,
  "notifications": true
}
```

#### Пример ответа

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "60d21b4667d0d8992e610c85",
      "username": "testuser",
      "level": 1,
      "xp": 0,
      "startingWeight": 80,
      "currentWeight": 78,
      "targetWeight": 70,
      "daysWithoutGames": 0,
      "longestStreakGames": 0,
      "projectsCreated": 0,
      "daysCoding": 0,
      "cyclingWorkouts": 0,
      "workTasks": 0,
      "achievements": [],
      "notifications": true,
      "createdAt": "2023-06-22T10:00:00.000Z",
      "updatedAt": "2023-06-22T10:00:00.000Z"
    }
  },
  "message": "Данные пользователя обновлены успешно"
}
```

### Сброс прогресса пользователя

```
POST /user/reset
```

#### Заголовки запроса

| Заголовок | Значение |
|-----------|----------|
| Authorization | Bearer {token} |

#### Параметры запроса

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| confirm | boolean | Да | Подтверждение сброса прогресса |

#### Пример запроса

```json
{
  "confirm": true
}
```

#### Пример ответа

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "60d21b4667d0d8992e610c85",
      "username": "testuser",
      "level": 1,
      "xp": 0,
      "startingWeight": 80,
      "currentWeight": 80,
      "targetWeight": 70,
      "daysWithoutGames": 0,
      "longestStreakGames": 0,
      "projectsCreated": 0,
      "daysCoding": 0,
      "cyclingWorkouts": 0,
      "workTasks": 0,
      "achievements": [],
      "notifications": true,
      "createdAt": "2023-06-22T10:00:00.000Z",
      "updatedAt": "2023-06-22T10:00:00.000Z"
    }
  },
  "message": "Прогресс пользователя сброшен успешно"
}
```

## Привычки

### Получение списка привычек

```
GET /habits
```

#### Заголовки запроса

| Заголовок | Значение |
|-----------|----------|
| Authorization | Bearer {token} |

#### Пример ответа

```json
{
  "success": true,
  "data": {
    "habits": [
      {
        "_id": "60d21b4667d0d8992e610c86",
        "userId": "60d21b4667d0d8992e610c85",
        "name": "Отказ от игр",
        "description": "Не играть в компьютерные игры",
        "progress": 5,
        "goal": 30,
        "history": [
          {
            "date": "2023-06-22T10:00:00.000Z",
            "completed": true
          },
          {
            "date": "2023-06-23T10:00:00.000Z",
            "completed": true
          }
        ],
        "createdAt": "2023-06-22T10:00:00.000Z",
        "updatedAt": "2023-06-23T10:00:00.000Z"
      },
      {
        "_id": "60d21b4667d0d8992e610c87",
        "userId": "60d21b4667d0d8992e610c85",
        "name": "Создание продуктов",
        "description": "Создавать продукты с использованием кода и ИИ",
        "progress": 1,
        "goal": 10,
        "history": [
          {
            "date": "2023-06-22T10:00:00.000Z",
            "completed": true
          }
        ],
        "createdAt": "2023-06-22T10:00:00.000Z",
        "updatedAt": "2023-06-22T10:00:00.000Z"
      }
    ]
  },
  "message": "Список привычек получен успешно"
}
```

### Создание привычки

```
POST /habits
```

#### Заголовки запроса

| Заголовок | Значение |
|-----------|----------|
| Authorization | Bearer {token} |

#### Параметры запроса

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| name | string | Да | Название привычки |
| description | string | Нет | Описание привычки |
| goal | number | Нет | Цель привычки |

#### Пример запроса

```json
{
  "name": "Сайклинг",
  "description": "Заниматься сайклингом",
  "goal": 20
}
```

#### Пример ответа

```json
{
  "success": true,
  "data": {
    "habit": {
      "_id": "60d21b4667d0d8992e610c88",
      "userId": "60d21b4667d0d8992e610c85",
      "name": "Сайклинг",
      "description": "Заниматься сайклингом",
      "progress": 0,
      "goal": 20,
      "history": [],
      "createdAt": "2023-06-24T10:00:00.000Z",
      "updatedAt": "2023-06-24T10:00:00.000Z"
    }
  },
  "message": "Привычка создана успешно"
}
```

### Обновление привычки

```
PUT /habits/:id
```

#### Заголовки запроса

| Заголовок | Значение |
|-----------|----------|
| Authorization | Bearer {token} |

#### Параметры пути

| Параметр | Описание |
|----------|----------|
| id | ID привычки |

#### Параметры запроса

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| name | string | Нет | Название привычки |
| description | string | Нет | Описание привычки |
| goal | number | Нет | Цель привычки |

#### Пример запроса

```json
{
  "name": "Сайклинг",
  "description": "Заниматься сайклингом регулярно",
  "goal": 30
}
```

#### Пример ответа

```json
{
  "success": true,
  "data": {
    "habit": {
      "_id": "60d21b4667d0d8992e610c88",
      "userId": "60d21b4667d0d8992e610c85",
      "name": "Сайклинг",
      "description": "Заниматься сайклингом регулярно",
      "progress": 0,
      "goal": 30,
      "history": [],
      "createdAt": "2023-06-24T10:00:00.000Z",
      "updatedAt": "2023-06-24T10:00:00.000Z"
    }
  },
  "message": "Привычка обновлена успешно"
}
```

### Удаление привычки

```
DELETE /habits/:id
```

#### Заголовки запроса

| Заголовок | Значение |
|-----------|----------|
| Authorization | Bearer {token} |

#### Параметры пути

| Параметр | Описание |
|----------|----------|
| id | ID привычки |

#### Пример ответа

```json
{
  "success": true,
  "data": {},
  "message": "Привычка удалена успешно"
}
```

### Отметка выполнения привычки

```
POST /habits/:id/complete
```

#### Заголовки запроса

| Заголовок | Значение |
|-----------|----------|
| Authorization | Bearer {token} |

#### Параметры пути

| Параметр | Описание |
|----------|----------|
| id | ID привычки |

#### Пример ответа

```json
{
  "success": true,
  "data": {
    "habit": {
      "_id": "60d21b4667d0d8992e610c88",
      "userId": "60d21b4667d0d8992e610c85",
      "name": "Сайклинг",
      "description": "Заниматься сайклингом регулярно",
      "progress": 1,
      "goal": 30,
      "history": [
        {
          "date": "2023-06-24T10:00:00.000Z",
          "completed": true
        }
      ],
      "createdAt": "2023-06-24T10:00:00.000Z",
      "updatedAt": "2023-06-24T10:00:00.000Z"
    },
    "user": {
      "_id": "60d21b4667d0d8992e610c85",
      "username": "testuser",
      "level": 1,
      "xp": 15,
      "startingWeight": 80,
      "currentWeight": 78,
      "targetWeight": 70,
      "daysWithoutGames": 0,
      "longestStreakGames": 0,
      "projectsCreated": 0,
      "daysCoding": 0,
      "cyclingWorkouts": 1,
      "workTasks": 0,
      "achievements": [],
      "notifications": true,
      "createdAt": "2023-06-22T10:00:00.000Z",
      "updatedAt": "2023-06-24T10:00:00.000Z"
    },
    "newAchievements": []
  },
  "message": "Привычка отмечена как выполненная"
}
```

## Задачи

### Получение списка задач

```
GET /tasks
```

#### Заголовки запроса

| Заголовок | Значение |
|-----------|----------|
| Authorization | Bearer {token} |

#### Параметры запроса

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| completed | boolean | Нет | Фильтр по статусу выполнения |

#### Пример ответа

```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "_id": "60d21b4667d0d8992e610c89",
        "userId": "60d21b4667d0d8992e610c85",
        "title": "Создать новый проект",
        "description": "Создать новый проект с использованием Next.js",
        "size": "large",
        "completed": false,
        "completedAt": null,
        "createdAt": "2023-06-24T10:00:00.000Z",
        "updatedAt": "2023-06-24T10:00:00.000Z"
      },
      {
        "_id": "60d21b4667d0d8992e610c90",
        "userId": "60d21b4667d0d8992e610c85",
        "title": "Написать документацию",
        "description": "Написать документацию для проекта",
        "size": "medium",
        "completed": false,
        "completedAt": null,
        "createdAt": "2023-06-24T10:00:00.000Z",
        "updatedAt": "2023-06-24T10:00:00.000Z"
      }
    ]
  },
  "message": "Список задач получен успешно"
}
```

### Создание задачи

```
POST /tasks
```

#### Заголовки запроса

| Заголовок | Значение |
|-----------|----------|
| Authorization | Bearer {token} |

#### Параметры запроса

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| title | string | Да | Название задачи |
| description | string | Нет | Описание задачи |
| size | string | Да | Размер задачи (small, medium, large) |

#### Пример запроса

```json
{
  "title": "Тестирование проекта",
  "description": "Написать тесты для проекта",
  "size": "medium"
}
```

#### Пример ответа

```json
{
  "success": true,
  "data": {
    "task": {
      "_id": "60d21b4667d0d8992e610c91",
      "userId": "60d21b4667d0d8992e610c85",
      "title": "Тестирование проекта",
      "description": "Написать тесты для проекта",
      "size": "medium",
      "completed": false,
      "completedAt": null,
      "createdAt": "2023-06-24T10:00:00.000Z",
      "updatedAt": "2023-06-24T10:00:00.000Z"
    }
  },
  "message": "Задача создана успешно"
}
```

### Обновление задачи

```
PUT /tasks/:id
```

#### Заголовки запроса

| Заголовок | Значение |
|-----------|----------|
| Authorization | Bearer {token} |

#### Параметры пути

| Параметр | Описание |
|----------|----------|
| id | ID задачи |

#### Параметры запроса

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| title | string | Нет | Название задачи |
| description | string | Нет | Описание задачи |
| size | string | Нет | Размер задачи (small, medium, large) |

#### Пример запроса

```json
{
  "title": "Тестирование проекта",
  "description": "Написать unit-тесты для проекта",
  "size": "large"
}
```

#### Пример ответа

```json
{
  "success": true,
  "data": {
    "task": {
      "_id": "60d21b4667d0d8992e610c91",
      "userId": "60d21b4667d0d8992e610c85",
      "title": "Тестирование проекта",
      "description": "Написать unit-тесты для проекта",
      "size": "large",
      "completed": false,
      "completedAt": null,
      "createdAt": "2023-06-24T10:00:00.000Z",
      "updatedAt": "2023-06-24T10:00:00.000Z"
    }
  },
  "message": "Задача обновлена успешно"
}
```

### Удаление задачи

```
DELETE /tasks/:id
```

#### Заголовки запроса

| Заголовок | Значение |
|-----------|----------|
| Authorization | Bearer {token} |

#### Параметры пути

| Параметр | Описание |
|----------|----------|
| id | ID задачи |

#### Пример ответа

```json
{
  "success": true,
  "data": {},
  "message": "Задача удалена успешно"
}
```

### Выполнение задачи

```
POST /tasks/:id/complete
```

#### Заголовки запроса

| Заголовок | Значение |
|-----------|----------|
| Authorization | Bearer {token} |

#### Параметры пути

| Параметр | Описание |
|----------|----------|
| id | ID задачи |

#### Пример ответа

```json
{
  "success": true,
  "data": {
    "task": {
      "_id": "60d21b4667d0d8992e610c91",
      "userId": "60d21b4667d0d8992e610c85",
      "title": "Тестирование проекта",
      "description": "Написать unit-тесты для проекта",
      "size": "large",
      "completed": true,
      "completedAt": "2023-06-24T10:00:00.000Z",
      "createdAt": "2023-06-24T10:00:00.000Z",
      "updatedAt": "2023-06-24T10:00:00.000Z"
    },
    "user": {
      "_id": "60d21b4667d0d8992e610c85",
      "username": "testuser",
      "level": 1,
      "xp": 35,
      "startingWeight": 80,
      "currentWeight": 78,
      "targetWeight": 70,
      "daysWithoutGames": 0,
      "longestStreakGames": 0,
      "projectsCreated": 0,
      "daysCoding": 0,
      "cyclingWorkouts": 1,
      "workTasks": 1,
      "achievements": [],
      "notifications": true,
      "createdAt": "2023-06-22T10:00:00.000Z",
      "updatedAt": "2023-06-24T10:00:00.000Z"
    },
    "newAchievements": []
  },
  "message": "Задача отмечена как выполненная"
}
```

## Достижения

### Получение списка достижений

```
GET /achievements
```

#### Заголовки запроса

| Заголовок | Значение |
|-----------|----------|
| Authorization | Bearer {token} |

#### Пример ответа

```json
{
  "success": true,
  "data": {
    "achievements": [
      {
        "_id": "60d21b4667d0d8992e610c92",
        "userId": "60d21b4667d0d8992e610c85",
        "name": "7 дней без игр",
        "description": "Продержаться неделю без компьютерных игр",
        "icon": "gamepad",
        "unlocked": true,
        "unlockedAt": "2023-06-24T10:00:00.000Z",
        "createdAt": "2023-06-24T10:00:00.000Z"
      },
      {
        "_id": "60d21b4667d0d8992e610c93",
        "userId": "60d21b4667d0d8992e610c85",
        "name": "Первый продукт",
        "description": "Создать и запустить первый продукт",
        "icon": "code",
        "unlocked": false,
        "unlockedAt": null,
        "createdAt": "2023-06-24T10:00:00.000Z"
      }
    ]
  },
  "message": "Список достижений получен успешно"
}
```

## Статистика

### Получение статистики пользователя

```
GET /statistics
```

#### Заголовки запроса

| Заголовок | Значение |
|-----------|----------|
| Authorization | Bearer {token} |

#### Параметры запроса

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| period | string | Нет | Период статистики (day, week, month, year, all) |

#### Пример ответа

```json
{
  "success": true,
  "data": {
    "statistics": {
      "level": 1,
      "xp": 35,
      "xpForNextLevel": 100,
      "daysWithoutGames": 0,
      "longestStreakGames": 0,
      "projectsCreated": 0,
      "daysCoding": 0,
      "cyclingWorkouts": 1,
      "workTasks": 1,
      "startingWeight": 80,
      "currentWeight": 78,
      "targetWeight": 70,
      "weightLost": 2,
      "achievementsUnlocked": 1,
      "tasksCompleted": 1,
      "habitsCompleted": 1
    }
  },
  "message": "Статистика получена успешно"
}
``` 