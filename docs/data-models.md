# Модели данных

В этом документе описаны модели данных, используемые в проекте "Геймификация жизни v0.2". Модели представлены в формате MongoDB схем.

## Пользователь (User)

```javascript
{
  _id: ObjectId,
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  level: {
    type: Number,
    default: 1
  },
  xp: {
    type: Number,
    default: 0
  },
  startingWeight: {
    type: Number,
    default: 0
  },
  currentWeight: {
    type: Number,
    default: 0
  },
  targetWeight: {
    type: Number,
    default: 0
  },
  daysWithoutGames: {
    type: Number,
    default: 0
  },
  longestStreakGames: {
    type: Number,
    default: 0
  },
  projectsCreated: {
    type: Number,
    default: 0
  },
  daysCoding: {
    type: Number,
    default: 0
  },
  cyclingWorkouts: {
    type: Number,
    default: 0
  },
  workTasks: {
    type: Number,
    default: 0
  },
  achievements: [{
    type: ObjectId,
    ref: 'Achievement'
  }],
  notifications: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

### Описание полей

| Поле | Тип | Описание |
|------|-----|----------|
| _id | ObjectId | Уникальный идентификатор пользователя |
| username | String | Имя пользователя (уникальное) |
| password | String | Хешированный пароль пользователя |
| level | Number | Текущий уровень пользователя |
| xp | Number | Текущее количество опыта пользователя |
| startingWeight | Number | Начальный вес пользователя |
| currentWeight | Number | Текущий вес пользователя |
| targetWeight | Number | Целевой вес пользователя |
| daysWithoutGames | Number | Количество дней без компьютерных игр |
| longestStreakGames | Number | Самая длинная серия дней без компьютерных игр |
| projectsCreated | Number | Количество созданных проектов |
| daysCoding | Number | Количество дней, в которые пользователь писал код |
| cyclingWorkouts | Number | Количество тренировок по сайклингу |
| workTasks | Number | Количество выполненных рабочих задач |
| achievements | Array | Массив идентификаторов достижений пользователя |
| notifications | Boolean | Включены ли уведомления |
| createdAt | Date | Дата создания аккаунта |
| updatedAt | Date | Дата последнего обновления аккаунта |

## Привычка (Habit)

```javascript
{
  _id: ObjectId,
  userId: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  description: {
    type: String,
    trim: true,
    maxlength: 200
  },
  progress: {
    type: Number,
    default: 0
  },
  goal: {
    type: Number,
    default: 30
  },
  history: [{
    date: {
      type: Date,
      default: Date.now
    },
    completed: {
      type: Boolean,
      default: true
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

### Описание полей

| Поле | Тип | Описание |
|------|-----|----------|
| _id | ObjectId | Уникальный идентификатор привычки |
| userId | ObjectId | Идентификатор пользователя, которому принадлежит привычка |
| name | String | Название привычки |
| description | String | Описание привычки |
| progress | Number | Текущий прогресс привычки |
| goal | Number | Цель привычки |
| history | Array | История выполнения привычки |
| history.date | Date | Дата выполнения привычки |
| history.completed | Boolean | Была ли привычка выполнена в указанную дату |
| createdAt | Date | Дата создания привычки |
| updatedAt | Date | Дата последнего обновления привычки |

## Задача (Task)

```javascript
{
  _id: ObjectId,
  userId: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  size: {
    type: String,
    enum: ['small', 'medium', 'large'],
    default: 'medium'
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

### Описание полей

| Поле | Тип | Описание |
|------|-----|----------|
| _id | ObjectId | Уникальный идентификатор задачи |
| userId | ObjectId | Идентификатор пользователя, которому принадлежит задача |
| title | String | Название задачи |
| description | String | Описание задачи |
| size | String | Размер задачи (small, medium, large) |
| completed | Boolean | Выполнена ли задача |
| completedAt | Date | Дата выполнения задачи |
| createdAt | Date | Дата создания задачи |
| updatedAt | Date | Дата последнего обновления задачи |

## Достижение (Achievement)

```javascript
{
  _id: ObjectId,
  userId: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  icon: {
    type: String,
    required: true
  },
  unlocked: {
    type: Boolean,
    default: false
  },
  unlockedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

### Описание полей

| Поле | Тип | Описание |
|------|-----|----------|
| _id | ObjectId | Уникальный идентификатор достижения |
| userId | ObjectId | Идентификатор пользователя, которому принадлежит достижение |
| name | String | Название достижения |
| description | String | Описание достижения |
| icon | String | Иконка достижения |
| unlocked | Boolean | Разблокировано ли достижение |
| unlockedAt | Date | Дата разблокировки достижения |
| createdAt | Date | Дата создания достижения |

## Система опыта и уровней

Система опыта и уровней в приложении "Геймификация жизни" работает следующим образом:

1. Пользователь начинает с 1 уровня и 0 опыта (XP).
2. За выполнение различных действий пользователь получает опыт:
   - Выполнение привычки: +15 XP
   - Выполнение задачи:
     - Маленькая: +10 XP
     - Средняя: +20 XP
     - Большая: +30 XP
   - Получение достижения: +50 XP

3. Для перехода на следующий уровень требуется определенное количество опыта:
   - Уровень 2: 100 XP
   - Уровень 3: 200 XP
   - Уровень 4: 300 XP
   - Уровень 5: 400 XP
   - Уровень 6: 500 XP
   - Уровень 7: 600 XP
   - Уровень 8: 700 XP
   - Уровень 9: 800 XP
   - Уровень 10: 900 XP
   - Уровень 11 и выше: предыдущий уровень + 100 XP

4. При достижении необходимого количества опыта пользователь переходит на следующий уровень, а счетчик опыта сбрасывается до остатка.

## Система достижений

В приложении "Геймификация жизни" реализована система достижений, которая мотивирует пользователей выполнять различные действия. Вот список доступных достижений:

### Достижения, связанные с отказом от игр

1. **7 дней без игр** - Продержаться неделю без компьютерных игр
2. **30 дней без игр** - Продержаться месяц без компьютерных игр
3. **90 дней без игр** - Продержаться 3 месяца без компьютерных игр
4. **365 дней без игр** - Продержаться год без компьютерных игр

### Достижения, связанные с созданием продуктов

1. **Первый продукт** - Создать и запустить первый продукт
2. **5 продуктов** - Создать и запустить 5 продуктов
3. **10 продуктов** - Создать и запустить 10 продуктов

### Достижения, связанные с программированием

1. **7 дней кодинга** - Писать код 7 дней подряд
2. **30 дней кодинга** - Писать код 30 дней подряд
3. **100 дней кодинга** - Писать код 100 дней подряд

### Достижения, связанные с сайклингом

1. **5 тренировок** - Выполнить 5 тренировок по сайклингу
2. **20 тренировок** - Выполнить 20 тренировок по сайклингу
3. **50 тренировок** - Выполнить 50 тренировок по сайклингу

### Достижения, связанные с рабочими задачами

1. **10 задач** - Выполнить 10 рабочих задач
2. **50 задач** - Выполнить 50 рабочих задач
3. **100 задач** - Выполнить 100 рабочих задач

### Достижения, связанные с весом

1. **Первый килограмм** - Сбросить первый килограмм веса
2. **5 килограмм** - Сбросить 5 килограмм веса
3. **10 килограмм** - Сбросить 10 килограмм веса
4. **Достигнута цель** - Достичь целевого веса 