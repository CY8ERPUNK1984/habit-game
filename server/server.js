const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'users.json');

// Настройка CORS
const corsOptions = {
    origin: '*', // Разрешаем запросы с любого источника
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Разрешенные методы
    allowedHeaders: ['Content-Type', 'Authorization'] // Разрешенные заголовки
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Локальное хранилище данных
let users = {};

// Загрузка данных из файла при запуске
try {
    if (fs.existsSync(DATA_FILE)) {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        users = JSON.parse(data);
        console.log('Данные пользователей загружены из файла');
    } else {
        console.log('Файл с данными не найден, создаем новый');
        fs.writeFileSync(DATA_FILE, JSON.stringify(users), 'utf8');
    }
} catch (err) {
    console.error('Ошибка при загрузке данных:', err);
    users = {};
}

// Сохранение данных в файл
function saveData() {
    try {
        console.log('Сохранение данных в файл...');
        fs.writeFileSync(DATA_FILE, JSON.stringify(users), 'utf8');
        console.log('Данные успешно сохранены в файл');
    } catch (err) {
        console.error('Ошибка при сохранении данных:', err);
    }
}

// Маршруты API
app.get('/api/user/:username', (req, res) => {
    try {
        const username = req.params.username;
        
        if (!users[username]) {
            // Создаем нового пользователя, если он не существует
            users[username] = {
                username,
                level: 1,
                xp: 0,
                startingWeight: 0,
                currentWeight: 0,
                targetWeight: 65,
                daysWithoutGames: 0,
                longestStreakGames: 0,
                projectsCreated: 0,
                daysCoding: 0,
                cyclingWorkouts: 0,
                workTasks: 0,
                achievements: [],
                notifications: true,
                todos: [], // Добавляем пустой список задач
                createdAt: new Date().toISOString()
            };
            saveData();
        }
        
        res.json(users[username]);
    } catch (err) {
        console.error('Ошибка при получении данных пользователя:', err);
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/user/update', (req, res) => {
    try {
        const { username, field, value } = req.body;
        
        if (!username || !field) {
            return res.status(400).json({ message: 'Отсутствуют обязательные поля' });
        }
        
        if (!users[username]) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }
        
        // Обновляем поле
        users[username][field] = value;
        
        // Проверка достижений
        const achievements = [];
        
        // 7 дней без игр
        if (field === 'daysWithoutGames' && value >= 7 && !users[username].achievements.includes('7-days-no-games')) {
            achievements.push('7-days-no-games');
            addXP(username, 50);
        }
        
        // Первый продукт
        if (field === 'projectsCreated' && value >= 1 && !users[username].achievements.includes('first-product')) {
            achievements.push('first-product');
            addXP(username, 50);
        }
        
        // Снижение веса на 5 кг
        if (field === 'currentWeight' && 
            users[username].startingWeight > 0 && 
            (users[username].startingWeight - value) >= 5 && 
            !users[username].achievements.includes('weight-loss-5kg')) {
            achievements.push('weight-loss-5kg');
            addXP(username, 100);
        }
        
        // Добавляем опыт за различные действия
        if (field === 'daysWithoutGames') {
            addXP(username, 10);
        } else if (field === 'projectsCreated') {
            addXP(username, 20);
        } else if (field === 'cyclingWorkouts') {
            addXP(username, 15);
        } else if (field === 'workTasks') {
            addXP(username, 10);
        }
        
        if (achievements.length > 0) {
            users[username].achievements = [...users[username].achievements, ...achievements];
        }
        
        // Сохраняем данные
        saveData();
        
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
        users[username].level += 1;
        // Опыт не сбрасываем, а оставляем излишек
    }
}

// Функция для расчета необходимого опыта для уровня
function calculateXPForLevel(level) {
    // Простая формула: каждый следующий уровень требует на 50 опыта больше
    return 100 + (level - 2) * 50;
}

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
                todos: [], // Добавляем пустой список задач
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
        const todos = users[username].todos || []; // Сохраняем список задач
        
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

// Обработка всех остальных запросов (для SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
}); 