# Геймификация жизни

Веб-приложение для геймификации жизни и формирования привычек. Превращает любую деятельность в увлекательный процесс с уровнями, достижениями и визуальными наградами.

## Ключевые функции

- **Уровни**: Повышайте свой уровень, выполняя ежедневные задания
- **Достижения**: Разблокируйте ачивки за ключевые этапы
- **Прогресс-бары**: Визуализация прогресса по каждой привычке
- **Конфетти**: Визуальные эффекты при выполнении заданий

## Ключевые привычки

- Отказ от компьютерных игр и источников быстрого дофамина
- Создание продуктов и сервисов с использованием кода и ИИ
- Занятия сайклингом и снижение веса до 65 кг

## Технологии

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- База данных: MongoDB

## Установка и запуск

### Требования

- Node.js (версия 14 или выше)
- MongoDB (локально или удаленно)

### Шаги установки

1. Клонируйте репозиторий:
```
git clone https://github.com/yourusername/habit-game.git
cd habit-game
```

2. Установите зависимости:
```
cd server
npm install
```

3. Настройте переменные окружения:
Создайте файл `.env` в директории `server` со следующим содержимым:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/habit-game
```

4. Запустите сервер:
```
npm start
```

5. Откройте приложение в браузере:
```
http://localhost:3000
```

## Использование

1. При первом запуске введите свое имя пользователя и начальные настройки
2. Отмечайте выполнение привычек с помощью соответствующих кнопок
3. Выполняйте ежедневные задания для повышения уровня
4. Следите за своим прогрессом в разделе "Статистика"
5. Разблокируйте достижения в разделе "Достижения"

## Лицензия

MIT 

## Автор

**Степан Зинин**

- Телеграм: [@stepanzinin](https://t.me/stepanzinin)
- Блог проекта: [@gamelife](https://wip.co/projects/gamelife)

## Комментарии к коду приложения "Геймификация жизни"

### 1. Структура проекта

```
habit-game/
├── client/                  # Пустая папка для будущего развития проекта
├── public/                  # Клиентская часть приложения (то, что видит пользователь)
│   ├── css/                 # Стили оформления (как выглядит приложение)
│   │   └── style.css        # Файл со стилями
│   │   
│   │   └── img/                 # Изображения для приложения
│   │   │   ├── favicon.png      # Иконка сайта (маленькая)
│   │   │   ├── favicon.svg      # Векторная иконка сайта
│   │   │   └── convert-favicon.html # Вспомогательный файл для конвертации иконки
│   │   └── js/                  # JavaScript файлы (логика работы приложения)
│   │   │   └── app.js           # Основной файл с логикой приложения
│   │   └── index.html           # Главная страница приложения (структура интерфейса)
│   └── server/                  # Серверная часть приложения (обработка данных)
│   │   ├── node_modules/        # Установленные библиотеки для сервера
│   │   ├── .env                 # Файл с настройками сервера
│   │   ├── package.json         # Описание проекта и зависимостей
│   │   ├── package-lock.json    # Точные версии зависимостей
│   │   ├── server.js            # Код сервера (обработка запросов)
│   │   └── users.json           # Файл для хранения данных пользователей
│   └── README.md                # Описание проекта и инструкции
```

### 2. Файл server.js (сервер)

```javascript
// Подключение необходимых библиотек
const express = require('express');  // Основной фреймворк для создания сервера
const cors = require('cors');        // Разрешает запросы с разных источников
const path = require('path');        // Работа с путями к файлам
const fs = require('fs');            // Работа с файловой системой
require('dotenv').config();          // Загрузка настроек из файла .env

// Создание приложения и настройка порта
const app = express();               // Создаем сервер
const PORT = process.env.PORT || 3000; // Порт, на котором будет работать сервер
const DATA_FILE = path.join(__dirname, 'users.json'); // Путь к файлу с данными пользователей

// Настройка CORS (разрешение запросов с разных источников)
const corsOptions = {
    origin: '*',                     // Разрешаем запросы откуда угодно
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Разрешенные методы запросов
    allowedHeaders: ['Content-Type', 'Authorization'] // Разрешенные заголовки
};

// Настройка промежуточного ПО (middleware)
app.use(cors(corsOptions));          // Применяем настройки CORS
app.use(express.json());             // Разрешаем обработку JSON в запросах
app.use(express.static(path.join(__dirname, '../public'))); // Указываем папку с файлами для клиента

// Локальное хранилище данных пользователей
let users = {};

// Загрузка данных из файла при запуске сервера
try {
    // Проверяем, существует ли файл с данными
    if (fs.existsSync(DATA_FILE)) {
        // Если файл существует, читаем его и загружаем данные
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        users = JSON.parse(data);
        console.log('Данные пользователей загружены из файла');
    } else {
        // Если файла нет, создаем новый пустой файл
        console.log('Файл с данными не найден, создаем новый');
        fs.writeFileSync(DATA_FILE, JSON.stringify(users), 'utf8');
    }
} catch (err) {
    // Если произошла ошибка, выводим ее и используем пустой объект
    console.error('Ошибка при загрузке данных:', err);
    users = {};
}

// Функция для сохранения данных в файл
function saveData() {
    try {
        console.log('Сохранение данных в файл...');
        fs.writeFileSync(DATA_FILE, JSON.stringify(users), 'utf8');
        console.log('Данные успешно сохранены в файл');
    } catch (err) {
        console.error('Ошибка при сохранении данных:', err);
    }
}

// Маршрут для получения данных пользователя
app.get('/api/user/:username', (req, res) => {
    try {
        const username = req.params.username;
        
        // Если пользователя нет, создаем нового
        if (!users[username]) {
            users[username] = {
                username,
                level: 1,                  // Начальный уровень
                xp: 0,                     // Начальный опыт
                startingWeight: 0,         // Начальный вес
                currentWeight: 0,          // Текущий вес
                targetWeight: 65,          // Целевой вес
                daysWithoutGames: 0,       // Дни без игр
                longestStreakGames: 0,     // Самая длинная серия без игр
                projectsCreated: 0,        // Созданные проекты
                daysCoding: 0,             // Дни кодинга
                cyclingWorkouts: 0,        // Тренировки сайклинга
                workTasks: 0,              // Рабочие задачи
                achievements: [],          // Достижения
                notifications: true,       // Уведомления включены
                todos: [],                 // Список задач
                createdAt: new Date().toISOString() // Дата создания
            };
            saveData(); // Сохраняем данные в файл
        }
        
        // Отправляем данные пользователя
        res.json(users[username]);
    } catch (err) {
        console.error('Ошибка при получении данных пользователя:', err);
        res.status(500).json({ message: err.message });
    }
});

// Маршрут для обновления данных пользователя
app.post('/api/user/update', (req, res) => {
    try {
        const { username, field, value } = req.body;
        
        // Проверяем наличие обязательных полей
        if (!username || !field) {
            return res.status(400).json({ message: 'Отсутствуют обязательные поля' });
        }
        
        // Проверяем существование пользователя
        if (!users[username]) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }
        
        // Обновляем указанное поле
        users[username][field] = value;
        
        // Проверяем достижения
        const achievements = [];
        
        // Достижение: 7 дней без игр
        if (field === 'daysWithoutGames' && value >= 7 && !users[username].achievements.includes('7-days-no-games')) {
            achievements.push('7-days-no-games');
            addXP(username, 50); // Добавляем опыт за достижение
        }
        
        // Достижение: Первый продукт
        if (field === 'projectsCreated' && value >= 1 && !users[username].achievements.includes('first-product')) {
            achievements.push('first-product');
            addXP(username, 50); // Добавляем опыт за достижение
        }
        
        // Достижение: Снижение веса на 5 кг
        if (field === 'currentWeight' && 
            users[username].startingWeight > 0 && 
            (users[username].startingWeight - value) >= 5 && 
            !users[username].achievements.includes('weight-loss-5kg')) {
            achievements.push('weight-loss-5kg');
            addXP(username, 100); // Добавляем опыт за достижение
        }
        
        // Добавляем опыт за различные действия
        if (field === 'daysWithoutGames') {
            addXP(username, 10); // Опыт за день без игр
        } else if (field === 'projectsCreated') {
            addXP(username, 20); // Опыт за созданный проект
        } else if (field === 'cyclingWorkouts') {
            addXP(username, 15); // Опыт за тренировку
        } else if (field === 'workTasks') {
            addXP(username, 10); // Опыт за рабочую задачу
        }
        
        // Добавляем новые достижения в список
        if (achievements.length > 0) {
            users[username].achievements = [...users[username].achievements, ...achievements];
        }
        
        // Сохраняем данные в файл
        saveData();
        
        // Отправляем обновленные данные и список новых достижений
        res.json({ user: users[username], newAchievements: achievements });
    } catch (err) {
        console.error('Ошибка при обновлении данных пользователя:', err);
        res.status(500).json({ message: err.message });
    }
});

// Функция для добавления опыта и проверки повышения уровня
function addXP(username, amount) {
    if (!users[username]) return;
    
    // Добавляем опыт
    users[username].xp = (users[username].xp || 0) + amount;
    
    // Проверяем, нужно ли повысить уровень
    const currentLevel = users[username].level;
    const xpForNextLevel = calculateXPForLevel(currentLevel + 1);
    
    if (users[username].xp >= xpForNextLevel) {
        users[username].level += 1; // Повышаем уровень
        // Опыт не сбрасываем, а оставляем излишек
    }
}

// Функция для расчета необходимого опыта для уровня
function calculateXPForLevel(level) {
    // Простая формула: каждый следующий уровень требует на 50 опыта больше
    return 100 + (level - 2) * 50;
}

// Маршрут для сохранения настроек пользователя
app.post('/api/user/settings', (req, res) => {
    try {
        const { username, startingWeight, targetWeight, notifications } = req.body;
        
        if (!username) {
            return res.status(400).json({ message: 'Отсутствует имя пользователя' });
        }
        
        // Если пользователь не существует, создаем нового
        if (!users[username]) {
            users[username] = {
                username,
                level: 1,
                xp: 0,
                startingWeight: startingWeight || 0,
                currentWeight: startingWeight || 0,
                targetWeight: targetWeight || 65,
                daysWithoutGames: 0,
                longestStreakGames: 0,
                projectsCreated: 0,
                daysCoding: 0,
                cyclingWorkouts: 0,
                workTasks: 0,
                achievements: [],
                todos: [],
                notifications: notifications !== undefined ? notifications : true,
                createdAt: new Date().toISOString()
            };
        } else {
            // Обновляем существующего пользователя
            if (startingWeight !== undefined) users[username].startingWeight = startingWeight;
            if (targetWeight !== undefined) users[username].targetWeight = targetWeight;
            if (notifications !== undefined) users[username].notifications = notifications;
        }
        
        // Сохраняем данные
        saveData();
        
        res.json(users[username]);
    } catch (err) {
        console.error('Ошибка при сохранении настроек:', err);
        res.status(500).json({ message: 'Ошибка сервера при сохранении настроек' });
    }
});

// Маршрут для сброса прогресса пользователя
app.post('/api/user/reset', (req, res) => {
    try {
        const { username } = req.body;
        
        if (!username) {
            return res.status(400).json({ message: 'Отсутствует имя пользователя' });
        }
        
        if (!users[username]) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }
        
        // Сохраняем некоторые базовые настройки и данные
        const startingWeight = users[username].startingWeight;
        const targetWeight = users[username].targetWeight;
        const notifications = users[username].notifications;
        const createdAt = users[username].createdAt;
        const todos = users[username].todos || [];
        
        // Сбрасываем прогресс пользователя
        users[username] = {
            username,
            level: 1,
            xp: 0,
            startingWeight,
            currentWeight: startingWeight,
            targetWeight,
            daysWithoutGames: 0,
            longestStreakGames: 0,
            projectsCreated: 0,
            daysCoding: 0,
            cyclingWorkouts: 0,
            workTasks: 0,
            achievements: [],
            notifications,
            createdAt,
            todos // Восстанавливаем список задач
        };
        
        // Сохраняем данные
        saveData();
        
        res.json(users[username]);
    } catch (err) {
        console.error('Ошибка при сбросе прогресса:', err);
        res.status(500).json({ message: 'Ошибка сервера при сбросе прогресса' });
    }
});

// Маршрут для обновления всех данных пользователя
app.put('/api/user/:username', (req, res) => {
    try {
        const username = req.params.username;
        const userData = req.body;
        
        console.log(`Получен запрос на обновление пользователя ${username}`);
        console.log('Данные запроса:', JSON.stringify(userData));
        
        if (!username) {
            console.log('Ошибка: отсутствует имя пользователя');
            return res.status(400).json({ message: 'Отсутствует имя пользователя' });
        }
        
        if (!users[username]) {
            console.log(`Ошибка: пользователь ${username} не найден`);
            return res.status(404).json({ message: 'Пользователь не найден' });
        }
        
        // Добавляем дополнительное логирование
        console.log('Текущие данные пользователя:', JSON.stringify(users[username]));
        
        try {
            // Обновляем данные пользователя, сохраняя username
            users[username] = { ...userData, username };
            
            // Проверяем, что данные обновились корректно
            console.log('Обновленные данные пользователя:', JSON.stringify(users[username]));
            
            // Сохраняем данные
            saveData();
            
            console.log(`Пользователь ${username} успешно обновлен`);
            return res.json(users[username]);
        } catch (updateError) {
            console.error('Ошибка при обновлении данных:', updateError);
            return res.status(500).json({ message: 'Ошибка при обновлении данных: ' + updateError.message });
        }
    } catch (err) {
        console.error('Ошибка при обновлении данных пользователя:', err);
        return res.status(500).json({ message: 'Ошибка сервера при обновлении данных пользователя: ' + err.message });
    }
});

// Тестовый маршрут для проверки работы сервера
app.get('/api/user/test', (req, res) => {
    res.json({
        username: 'test_user',
        level: 1,
        xp: 0,
        startingWeight: 75,
        currentWeight: 73,
        targetWeight: 65,
        daysWithoutGames: 3,
        longestStreakGames: 5,
        projectsCreated: 1,
        daysCoding: 7,
        cyclingWorkouts: 2,
        workTasks: 5,
        achievements: [],
        todos: [
            {
                id: '1',
                text: 'Тестовая задача (маленькая)',
                size: 'small',
                completed: false,
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                text: 'Тестовая задача (средняя)',
                size: 'medium',
                completed: false,
                createdAt: new Date().toISOString()
            },
            {
                id: '3',
                text: 'Тестовая задача (большая)',
                size: 'large',
                completed: true,
                createdAt: new Date().toISOString()
            }
        ],
        notifications: true,
        createdAt: new Date().toISOString()
    });
});

// Обработка всех остальных запросов (для одностраничного приложения)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
```

### 3. Файл index.html (структура интерфейса)

```html
<!DOCTYPE html>
<html lang="ru">
<head>
    <!-- Метаданные страницы -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Геймификация жизни</title>
    
    <!-- Иконки сайта -->
    <link rel="icon" href="img/favicon.svg" type="image/svg+xml">
    <link rel="alternate icon" href="img/favicon.png" type="image/png">
    
    <!-- Подключение стилей -->
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <!-- Основной контейнер приложения -->
    <div class="app-container">
        <!-- Шапка сайта -->
        <header class="main-header">
            <div class="logo-level-container">
                <h1>Геймификация</h1>
                <!-- Отображение уровня пользователя -->
                <div class="user-level">
                    <span class="level-label">Ур:</span>
                    <span class="level-value" id="user-level">1</span>
                </div>
            </div>
            
            <!-- Навигационное меню -->
            <nav>
                <ul>
                    <li class="active" data-tab="dashboard">Главная</li>
                    <li data-tab="achievements">Достижения</li>
                    <li data-tab="statistics">Статистика</li>
                    <li data-tab="settings">Настройки</li>
                </ul>
            </nav>
        </header>

        <!-- Обертка для основного содержимого -->
        <div class="content-wrapper">
            <!-- Левая часть - основной контент -->
            <main class="main-content">
                <!-- Вкладка "Главная" -->
                <section id="dashboard" class="tab-content active">
                    <!-- Информация об уровне -->
                    <div class="level-info">
                        <h2>Уровень <span id="dashboard-level">1</span></h2>
                        <div class="progress-container">
                            <div class="progress-bar" id="level-progress" style="width: 0%;">0%</div>
                        </div>
                        <p>Опыт: <span id="current-xp">0</span>/<span id="next-level-xp">100</span></p>
                    </div>
                    
                    <!-- Контейнер с привычками -->
                    <div class="habits-container">
                        <h2>Мои привычки</h2>
                        
                        <!-- Карточка привычки "Отказ от игр" -->
                        <div class="habit-card">
                            <h3>Отказ от игр</h3>
                            <div class="progress-container">
                                <div class="progress-bar" id="games-progress" style="width: 0%;">0%</div>
                            </div>
                            <p>Дней без игр: <span id="days-without-games">0</span></p>
                            <button class="habit-btn" data-habit="games">Отметить</button>
                        </div>
                        
                        <!-- Карточка привычки "Создание продуктов" -->
                        <div class="habit-card">
                            <h3>Создание продуктов</h3>
                            <div class="progress-container">
                                <div class="progress-bar" id="coding-progress" style="width: 0%;">0%</div>
                            </div>
                            <p>Проектов: <span id="projects-created">0</span></p>
                            <button class="habit-btn" data-habit="coding">Добавить</button>
                        </div>
                        
                        <!-- Карточка привычки "Сайклинг" -->
                        <div class="habit-card">
                            <h3>Сайклинг</h3>
                            <div class="progress-container">
                                <div class="progress-bar" id="cycling-progress" style="width: 0%;">0%</div>
                            </div>
                            <p>Вес: <span id="current-weight">0</span> кг</p>
                            <p>Цель: 65 кг</p>
                            <p>Тренировок: <span id="cycling-workouts">0</span></p>
                            <div class="button-group">
                                <button class="habit-btn" data-habit="cycling">Вес</button>
                                <button class="habit-btn" data-habit="cycling-workout">Тренировка</button>
                            </div>
                        </div>
                        
                        <!-- Карточка привычки "Работа" -->
                        <div class="habit-card">
                            <h3>Работа</h3>
                            <div class="progress-container">
                                <div class="progress-bar" id="work-progress" style="width: 0%;">0%</div>
                            </div>
                            <p>Задач: <span id="work-tasks">0</span></p>
                            <button class="habit-btn" data-habit="work">Отметить</button>
                        </div>
                    </div>
                </section>

                <!-- Вкладка "Достижения" -->
                <section id="achievements" class="tab-content">
                    <h2>Мои достижения</h2>
                    <div class="achievements-grid">
                        <!-- Достижение "7 дней без игр" -->
                        <div class="achievement locked" id="achievement-1">
                            <i class="fas fa-gamepad"></i>
                            <h3>7 дней без игр</h3>
                            <p>Продержаться неделю без компьютерных игр</p>
                        </div>
                        
                        <!-- Достижение "Первый продукт" -->
                        <div class="achievement locked" id="achievement-2">
                            <i class="fas fa-code"></i>
                            <h3>Первый продукт</h3>
                            <p>Создать и запустить первый продукт</p>
                        </div>
                        
                        <!-- Достижение "Снижение веса на 5 кг" -->
                        <div class="achievement locked" id="achievement-3">
                            <i class="fas fa-bicycle"></i>
                            <h3>Снижение веса на 5 кг</h3>
                            <p>Сбросить первые 5 кг</p>
                        </div>
                        
                        <!-- Достижение "30 дней подряд" -->
                        <div class="achievement locked" id="achievement-4">
                            <i class="fas fa-calendar-check"></i>
                            <h3>30 дней подряд</h3>
                            <p>Выполнять задания 30 дней подряд</p>
                        </div>
                    </div>
                </section>

                <!-- Вкладка "Статистика" -->
                <section id="statistics" class="tab-content">
                    <h2>Моя статистика</h2>
                    <div class="stats-container">
                        <!-- Статистика "Отказ от игр" -->
                        <div class="stat-card">
                            <h3>Отказ от игр</h3>
                            <p>Дней без игр: <span id="stats-days-without-games">0</span></p>
                            <p>Макс. период: <span id="stats-longest-streak-games">0</span> дн.</p>
                        </div>
                        
                        <!-- Статистика "Создание продуктов" -->
                        <div class="stat-card">
                            <h3>Создание продуктов</h3>
                            <p>Всего создано: <span id="stats-projects-created">0</span></p>
                            <p>Дней кодинга: <span id="stats-days-coding">0</span></p>
                        </div>
                        
                        <!-- Статистика "Сайклинг" -->
                        <div class="stat-card">
                            <h3>Сайклинг</h3>
                            <p>Начальный вес: <span id="stats-starting-weight">0</span> кг</p>
                            <p>Текущий вес: <span id="stats-current-weight">0</span> кг</p>
                            <p>Сброшено: <span id="stats-weight-lost">0</span> кг</p>
                            <p>Тренировок: <span id="stats-cycling-workouts">0</span></p>
                        </div>
                        
                        <!-- Статистика "Работа" -->
                        <div class="stat-card">
                            <h3>Работа</h3>
                            <p>Задач: <span id="stats-work-tasks">0</span></p>
                        </div>
                        
                        <!-- Статистика "Уровень и опыт" -->
                        <div class="stat-card">
                            <h3>Уровень и опыт</h3>
                            <p>Уровень: <span id="stats-level">1</span></p>
                            <p>Опыт: <span id="stats-xp">0</span></p>
                            <p>До след. уровня: <span id="stats-xp-needed">100</span></p>
                        </div>
                    </div>
                </section>

                <!-- Вкладка "Настройки" -->
                <section id="settings" class="tab-content">
                    <h2>Настройки</h2>
                    <form id="settings-form">
                        <!-- Поле для имени пользователя -->
                        <div class="form-group">
                            <label for="username">Имя пользователя:</label>
                            <input type="text" id="username" name="username">
                        </div>
                        
                        <!-- Поле для начального веса -->
                        <div class="form-group">
                            <label for="starting-weight">Начальный вес (кг):</label>
                            <input type="number" id="starting-weight" name="starting-weight">
                        </div>
                        
                        <!-- Поле для целевого веса -->
                        <div class="form-group">
                            <label for="target-weight">Целевой вес (кг):</label>
                            <input type="number" id="target-weight" name="target-weight" value="65">
                        </div>
                        
                        <!-- Настройка уведомлений -->
                        <div class="form-group">
                            <label>Уведомления:</label>
                            <div class="checkbox-group">
                                <input type="checkbox" id="notifications" name="notifications" checked>
                                <label for="notifications">Включить уведомления</label>
                            </div>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    </div>
</body>
</html>