document.addEventListener('DOMContentLoaded', () => {
    console.log('Страница загружена. Версия: 1.0.1');

    // Глобальные переменные
    let currentUser = null;
    const API_URL = window.location.origin + '/api';
    console.log('API URL:', API_URL);
    
    // DOM элементы
    const navItems = document.querySelectorAll('nav li');
    const tabContents = document.querySelectorAll('.tab-content');
    const userLevelElement = document.getElementById('user-level');
    const settingsForm = document.getElementById('settings-form');
    const usernameInput = document.getElementById('username');
    const startingWeightInput = document.getElementById('starting-weight');
    const targetWeightInput = document.getElementById('target-weight');
    const notificationsCheckbox = document.getElementById('notifications');
    const habitButtons = document.querySelectorAll('.habit-btn');
    const taskCheckboxes = document.querySelectorAll('#tasks-list input[type="checkbox"]');
    const levelUpModal = document.getElementById('level-up-modal');
    const newLevelElement = document.getElementById('new-level');
    const closeModalButton = document.getElementById('close-modal');
    const todoInput = document.getElementById('todo-input');
    const addTodoBtn = document.getElementById('add-todo-btn');
    const todoItems = document.getElementById('todo-items');
    
    // Инициализация приложения
    init();
    
    // Функции
    async function init() {
        // Проверка наличия сохраненного имени пользователя
        const savedUsername = localStorage.getItem('username');
        
        if (savedUsername) {
            await loadUserData(savedUsername);
        } else {
            // Показать настройки, если пользователь не найден
            showTab('settings');
            const activeNavItem = document.querySelector('nav li[data-tab="settings"]');
            setActiveNavItem(activeNavItem);
        }
        
        // Установка обработчиков событий
        setupEventListeners();
    }
    
    function setupEventListeners() {
        // Навигация по вкладкам
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const tabName = item.getAttribute('data-tab');
                showTab(tabName);
                setActiveNavItem(item);
            });
        });
        
        // Форма настроек
        settingsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = usernameInput.value.trim();
            const startingWeight = parseFloat(startingWeightInput.value) || 0;
            const targetWeight = parseFloat(targetWeightInput.value) || 65;
            const notifications = notificationsCheckbox.checked;
            
            if (!username) {
                alert('Пожалуйста, введите имя пользователя');
                return;
            }
            
            try {
                const response = await fetch(`${API_URL}/user/settings`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username,
                        startingWeight,
                        targetWeight,
                        notifications
                    })
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Ошибка сохранения настроек');
                }
                
                const data = await response.json();
                
                // Сохранение имени пользователя в localStorage
                localStorage.setItem('username', username);
                
                // Загрузка данных пользователя
                await loadUserData(username);
                
                // Переключение на главную вкладку
                showTab('dashboard');
                setActiveNavItem(document.querySelector('nav li[data-tab="dashboard"]'));
                
                alert('Настройки сохранены!');
            } catch (error) {
                console.error('Ошибка:', error);
                alert('Произошла ошибка при сохранении настроек: ' + error.message);
            }
        });
        
        // Кнопка сброса прогресса
        const resetProgressBtn = document.getElementById('reset-progress-btn');
        resetProgressBtn.addEventListener('click', async () => {
            if (!currentUser) {
                alert('Пожалуйста, сначала настройте профиль');
                return;
            }
            
            const confirmed = confirm('Вы уверены, что хотите сбросить весь прогресс? Это действие нельзя отменить.');
            if (!confirmed) return;
            
            try {
                const response = await fetch(`${API_URL}/user/reset`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: currentUser.username
                    })
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Ошибка сброса прогресса');
                }
                
                const data = await response.json();
                
                // Загрузка обновленных данных пользователя
                await loadUserData(currentUser.username);
                
                // Переключение на главную вкладку
                showTab('dashboard');
                setActiveNavItem(document.querySelector('nav li[data-tab="dashboard"]'));
                
                alert('Прогресс успешно сброшен!');
            } catch (error) {
                console.error('Ошибка:', error);
                alert('Произошла ошибка при сбросе прогресса: ' + error.message);
            }
        });
        
        // Кнопки привычек
        habitButtons.forEach(button => {
            button.addEventListener('click', async () => {
                const habitType = button.getAttribute('data-habit');
                
                if (!currentUser) {
                    showNotification('Пожалуйста, сначала настройте профиль', 'error');
                    return;
                }
                
                try {
                    let field, value;
                    
                    switch (habitType) {
                        case 'games':
                            field = 'daysWithoutGames';
                            value = currentUser.daysWithoutGames + 1;
                            break;
                        case 'coding':
                            field = 'projectsCreated';
                            value = currentUser.projectsCreated + 1;
                            
                            // Также увеличиваем количество дней кодинга
                            await updateUserField('daysCoding', currentUser.daysCoding + 1);
                            break;
                        case 'cycling':
                            const newWeight = prompt('Введите ваш текущий вес (кг):', currentUser.currentWeight);
                            
                            if (newWeight === null) return;
                            
                            field = 'currentWeight';
                            value = parseFloat(newWeight);
                            
                            if (isNaN(value) || value <= 0) {
                                showNotification('Пожалуйста, введите корректное значение веса', 'error');
                                return;
                            }
                            break;
                        case 'cycling-workout':
                            field = 'cyclingWorkouts';
                            value = (currentUser.cyclingWorkouts || 0) + 1;
                            break;
                        case 'work':
                            field = 'workTasks';
                            value = (currentUser.workTasks || 0) + 1;
                            break;
                    }
                    
                    const result = await updateUserField(field, value);
                    
                    // Проверка на новые достижения
                    if (result.newAchievements && result.newAchievements.length > 0) {
                        showAchievementUnlocked(result.newAchievements);
                    }
                    
                    // Обновление интерфейса
                    updateUI();
                    
                    // Показать конфетти
                    showConfetti();
                } catch (error) {
                    console.error('Ошибка при обновлении привычки:', error);
                    showNotification('Произошла ошибка при обновлении привычки: ' + error.message, 'error');
                }
            });
        });
        
        // Чекбоксы заданий
        taskCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    // Показать конфетти при выполнении задания
                    showConfetti();
                    
                    // Проверка всех заданий
                    const allCompleted = Array.from(taskCheckboxes).every(cb => cb.checked);
                    
                    if (allCompleted && currentUser) {
                        // Повышение уровня
                        levelUp();
                    }
                }
            });
        });
        
        // Закрытие модального окна
        closeModalButton.addEventListener('click', () => {
            levelUpModal.style.display = 'none';
        });
        
        // Todo List
        addTodoBtn.addEventListener('click', addTodoItem);
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTodoItem();
            }
        });
        
        // Делегирование событий для элементов todo list
        todoItems.addEventListener('click', (e) => {
            const target = e.target;
            
            // Обработка клика по чекбоксу
            if (target.classList.contains('todo-checkbox')) {
                const todoItem = target.closest('.todo-item');
                const todoId = todoItem.dataset.id;
                const isCompleted = target.checked;
                
                toggleTodoComplete(todoId, isCompleted);
            }
            
            // Обработка клика по кнопке удаления
            if (target.classList.contains('todo-delete')) {
                const todoItem = target.closest('.todo-item');
                const todoId = todoItem.dataset.id;
                
                deleteTodoItem(todoId);
            }
        });
    }
    
    function showTab(tabName) {
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        const selectedTab = document.getElementById(tabName);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
    }
    
    function setActiveNavItem(item) {
        navItems.forEach(navItem => {
            navItem.classList.remove('active');
        });
        
        item.classList.add('active');
    }
    
    async function loadUserData(username) {
        try {
            const response = await fetch(`${API_URL}/user/${username}`);
            
            if (!response.ok) {
                throw new Error('Пользователь не найден');
            }
            
            const userData = await response.json();
            currentUser = userData;
            
            // Инициализация полей формы настроек
            usernameInput.value = currentUser.username;
            startingWeightInput.value = currentUser.startingWeight || '';
            targetWeightInput.value = currentUser.targetWeight || 65;
            notificationsCheckbox.checked = currentUser.notifications !== false;
            
            // Если у пользователя нет списка задач, создаем его
            if (!currentUser.todos) {
                currentUser.todos = [];
            }
            
            // Обновление интерфейса
            updateUI();
            
            // Загрузка задач
            renderTodoItems();
            
        } catch (error) {
            console.error('Ошибка загрузки данных пользователя:', error);
            showNotification('Ошибка загрузки данных пользователя', 'error');
        }
    }
    
    async function updateUserField(field, value) {
        try {
            console.log(`Обновление поля ${field} на значение ${value} для пользователя ${currentUser.username}`);
            console.log('URL запроса:', `${API_URL}/user/update`);
            
            const response = await fetch(`${API_URL}/user/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: currentUser.username,
                    field,
                    value
                })
            });
            
            console.log('Статус ответа:', response.status);
            const responseText = await response.text();
            console.log('Текст ответа:', responseText);
            
            if (!response.ok) {
                throw new Error(`Ошибка обновления данных: ${responseText}`);
            }
            
            const result = JSON.parse(responseText);
            currentUser = result.user;
            
            return result;
        } catch (error) {
            console.error('Ошибка при обновлении поля:', error);
            showNotification(`Ошибка: ${error.message}`, 'error');
            throw error;
        }
    }
    
    function updateUI() {
        if (!currentUser) return;
        
        // Обновление уровня
        userLevelElement.textContent = currentUser.level;
        document.getElementById('dashboard-level').textContent = currentUser.level;
        
        // Обновление прогресса уровня
        updateLevelProgress();
        
        // Обновление прогресса привычек
        updateHabitProgress();
        
        // Обновление статистики
        updateStatistics();
        
        // Обновление достижений
        updateAchievements();
    }
    
    function updateLevelProgress() {
        const currentXP = currentUser.xp || 0;
        const currentLevel = currentUser.level;
        const xpForNextLevel = calculateXPForNextLevel(currentLevel);
        
        document.getElementById('current-xp').textContent = currentXP;
        document.getElementById('next-level-xp').textContent = xpForNextLevel;
        
        const levelProgress = Math.min((currentXP / xpForNextLevel) * 100, 100);
        const levelProgressBar = document.getElementById('level-progress');
        
        levelProgressBar.style.width = `${levelProgress}%`;
        levelProgressBar.textContent = `${Math.round(levelProgress)}%`;
    }
    
    function calculateXPForNextLevel(level) {
        // Эта формула должна соответствовать серверной
        return 100 + (level - 1) * 50;
    }
    
    function updateHabitProgress() {
        // Отказ от игр
        const gamesProgressBar = document.getElementById('games-progress');
        const daysWithoutGamesElement = document.getElementById('days-without-games');
        const gamesProgress = Math.min((currentUser.daysWithoutGames / 30) * 100, 100);
        
        gamesProgressBar.style.width = `${gamesProgress}%`;
        gamesProgressBar.textContent = `${Math.round(gamesProgress)}%`;
        daysWithoutGamesElement.textContent = currentUser.daysWithoutGames;
        
        // Создание продуктов
        const codingProgressBar = document.getElementById('coding-progress');
        const projectsCreatedElement = document.getElementById('projects-created');
        const codingProgress = Math.min((currentUser.projectsCreated / 5) * 100, 100);
        
        codingProgressBar.style.width = `${codingProgress}%`;
        codingProgressBar.textContent = `${Math.round(codingProgress)}%`;
        projectsCreatedElement.textContent = currentUser.projectsCreated;
        
        // Сайклинг и снижение веса
        const cyclingProgressBar = document.getElementById('cycling-progress');
        const currentWeightElement = document.getElementById('current-weight');
        const cyclingWorkoutsElement = document.getElementById('cycling-workouts');
        
        if (currentUser.startingWeight > 0 && currentUser.currentWeight > 0) {
            const weightDifference = currentUser.startingWeight - currentUser.currentWeight;
            const targetDifference = currentUser.startingWeight - currentUser.targetWeight;
            const weightProgress = Math.min((weightDifference / targetDifference) * 100, 100);
            
            cyclingProgressBar.style.width = `${weightProgress}%`;
            cyclingProgressBar.textContent = `${Math.round(weightProgress)}%`;
        } else {
            cyclingProgressBar.style.width = '0%';
            cyclingProgressBar.textContent = '0%';
        }
        
        currentWeightElement.textContent = currentUser.currentWeight > 0 ? currentUser.currentWeight : '—';
        cyclingWorkoutsElement.textContent = currentUser.cyclingWorkouts || 0;
        
        // Прогресс в работе
        const workProgressBar = document.getElementById('work-progress');
        const workTasksElement = document.getElementById('work-tasks');
        const workProgress = Math.min(((currentUser.workTasks || 0) / 20) * 100, 100);
        
        workProgressBar.style.width = `${workProgress}%`;
        workProgressBar.textContent = `${Math.round(workProgress)}%`;
        workTasksElement.textContent = currentUser.workTasks || 0;
    }
    
    function updateStatistics() {
        // Отказ от игр
        document.getElementById('stats-days-without-games').textContent = currentUser.daysWithoutGames;
        document.getElementById('stats-longest-streak-games').textContent = currentUser.longestStreakGames;
        
        // Создание продуктов
        document.getElementById('stats-projects-created').textContent = currentUser.projectsCreated;
        document.getElementById('stats-days-coding').textContent = currentUser.daysCoding;
        
        // Сайклинг и снижение веса
        document.getElementById('stats-starting-weight').textContent = currentUser.startingWeight > 0 ? currentUser.startingWeight : '—';
        document.getElementById('stats-current-weight').textContent = currentUser.currentWeight > 0 ? currentUser.currentWeight : '—';
        
        const weightLost = currentUser.startingWeight > 0 && currentUser.currentWeight > 0 
            ? (currentUser.startingWeight - currentUser.currentWeight).toFixed(1) 
            : '0';
        
        document.getElementById('stats-weight-lost').textContent = weightLost;
        document.getElementById('stats-cycling-workouts').textContent = currentUser.cyclingWorkouts || 0;
        
        // Прогресс в работе
        document.getElementById('stats-work-tasks').textContent = currentUser.workTasks || 0;
        
        // Уровень и опыт
        document.getElementById('stats-level').textContent = currentUser.level;
        document.getElementById('stats-xp').textContent = currentUser.xp || 0;
        
        const xpNeeded = calculateXPForNextLevel(currentUser.level) - (currentUser.xp || 0);
        document.getElementById('stats-xp-needed').textContent = xpNeeded > 0 ? xpNeeded : 0;
    }
    
    function updateAchievements() {
        // Проверка достижений
        if (currentUser.achievements.includes('7-days-no-games')) {
            unlockAchievement('achievement-1');
        }
        
        if (currentUser.achievements.includes('first-product')) {
            unlockAchievement('achievement-2');
        }
        
        if (currentUser.achievements.includes('weight-loss-5kg')) {
            unlockAchievement('achievement-3');
        }
        
        // 30 дней подряд (это достижение пока не реализовано в API)
        if (currentUser.achievements.includes('30-days-streak')) {
            unlockAchievement('achievement-4');
        }
    }
    
    function unlockAchievement(achievementId) {
        const achievement = document.getElementById(achievementId);
        
        if (achievement) {
            achievement.classList.remove('locked');
            achievement.classList.add('unlocked');
        }
    }
    
    function showAchievementUnlocked(achievements) {
        achievements.forEach(achievement => {
            let title = '';
            
            switch (achievement) {
                case '7-days-no-games':
                    title = '7 дней без игр';
                    break;
                case 'first-product':
                    title = 'Первый продукт';
                    break;
                case 'weight-loss-5kg':
                    title = 'Снижение веса на 5 кг';
                    break;
                case '30-days-streak':
                    title = '30 дней подряд';
                    break;
            }
            
            alert(`🏆 Достижение разблокировано: ${title}`);
        });
    }
    
    function levelUp() {
        if (!currentUser) return;
        
        const newLevel = currentUser.level + 1;
        
        // Обновление уровня в базе данных
        updateUserField('level', newLevel)
            .then(() => {
                // Показать модальное окно с поздравлением
                newLevelElement.textContent = newLevel;
                levelUpModal.style.display = 'flex';
                
                // Показать конфетти
                showConfetti();
                
                // Сбросить чекбоксы заданий
                taskCheckboxes.forEach(checkbox => {
                    checkbox.checked = false;
                });
            })
            .catch(error => {
                console.error('Ошибка при повышении уровня:', error);
            });
    }
    
    function addExperience(amount) {
        if (!currentUser) return;
        
        // Получаем текущий опыт и уровень
        let currentXP = currentUser.xp || 0;
        const currentLevel = currentUser.level;
        
        // Добавляем опыт
        currentXP += amount;
        
        // Проверяем, достаточно ли опыта для повышения уровня
        const xpForNextLevel = calculateXPForNextLevel(currentLevel);
        
        if (currentXP >= xpForNextLevel) {
            // Если достаточно, повышаем уровень и вычитаем необходимый опыт
            currentXP -= xpForNextLevel;
            
            // Обновляем опыт
            updateUserField('xp', currentXP)
                .then(() => {
                    // Повышаем уровень
                    levelUp();
                })
                .catch(error => {
                    console.error('Ошибка при обновлении опыта:', error);
                });
        } else {
            // Если недостаточно, просто обновляем опыт
            updateUserField('xp', currentXP)
                .then(() => {
                    // Обновляем интерфейс
                    updateUI();
                })
                .catch(error => {
                    console.error('Ошибка при обновлении опыта:', error);
                });
        }
    }
    
    function showNotification(message, type = 'info') {
        // Создаем элемент уведомления
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Добавляем уведомление в DOM
        document.body.appendChild(notification);
        
        // Показываем уведомление
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Скрываем и удаляем уведомление через 3 секунды
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    function showConfetti() {
        console.log('Вызвана функция showConfetti. Функция confetti существует:', typeof confetti === 'function');
        try {
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 }
                });
                console.log('Конфетти запущены успешно');
            } else {
                console.warn('Библиотека confetti не загружена');
            }
        } catch (error) {
            console.error('Ошибка при запуске конфетти:', error);
        }
    }
    
    // Todo List функции
    function addTodoItem() {
        const todoText = todoInput.value.trim();
        if (!todoText) return;
        
        console.log('Попытка добавления задачи:', todoText);
        
        // Проверяем, существует ли пользователь
        if (!currentUser) {
            showNotification('Пожалуйста, сначала настройте профиль', 'error');
            return;
        }
        
        // Проверяем, существует ли массив задач
        if (!currentUser.todos) {
            currentUser.todos = [];
        }
        
        const selectedSize = document.querySelector('input[name="todo-size"]:checked').value;
        
        const newTodo = {
            id: Date.now().toString(),
            text: todoText,
            size: selectedSize,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        // Сохраняем копию текущих задач
        const originalTodos = [...currentUser.todos];
        
        // Добавляем задачу в массив пользователя
        currentUser.todos.push(newTodo);
        
        // Сохраняем обновленные данные
        saveUserData()
            .then(() => {
                // Очищаем поле ввода
                todoInput.value = '';
                
                // Обновляем отображение задач
                renderTodoItems();
                
                // Показываем уведомление
                showNotification('Задача добавлена!', 'success');
            })
            .catch(error => {
                console.error('Ошибка при сохранении задачи:', error);
                
                // Восстанавливаем оригинальный список задач
                currentUser.todos = originalTodos;
                
                // Обновляем отображение задач
                renderTodoItems();
                
                // Показываем уведомление с детальной информацией об ошибке
                showNotification('Ошибка при добавлении задачи: ' + error.message, 'error');
            });
    }
    
    function renderTodoItems() {
        // Проверяем, существует ли пользователь и элемент списка задач
        if (!currentUser || !todoItems) {
            console.error('Ошибка: currentUser или todoItems не существуют');
            return;
        }
        
        // Проверяем, существует ли массив задач
        if (!currentUser.todos) {
            console.log('Создаем пустой массив задач');
            currentUser.todos = [];
        }
        
        try {
            // Сортируем задачи: сначала незавершенные, затем по дате создания (новые сверху)
            const sortedTodos = [...currentUser.todos].sort((a, b) => {
                if (a.completed !== b.completed) {
                    return a.completed ? 1 : -1;
                }
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
            
            // Очищаем список
            todoItems.innerHTML = '';
            
            // Добавляем задачи в список
            sortedTodos.forEach(todo => {
                const li = document.createElement('li');
                li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
                li.dataset.id = todo.id;
                
                // Определяем XP в зависимости от размера задачи
                const xpAmount = getXpForTodoSize(todo.size);
                
                // Определяем класс для бейджа размера
                const sizeClass = `todo-size-${todo.size}`;
                
                li.innerHTML = `
                    <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                    <span class="todo-size-badge ${sizeClass}">${todo.size.charAt(0).toUpperCase()}</span>
                    <span class="todo-text">${todo.text}</span>
                    <span class="todo-xp">+${xpAmount} XP</span>
                    <button class="todo-delete">&times;</button>
                `;
                
                todoItems.appendChild(li);
            });
        } catch (error) {
            console.error('Ошибка при отображении задач:', error);
            showNotification('Ошибка при отображении задач', 'error');
        }
    }
    
    function toggleTodoComplete(todoId, isCompleted) {
        const todoIndex = currentUser.todos.findIndex(todo => todo.id === todoId);
        if (todoIndex === -1) return;
        
        const todo = currentUser.todos[todoIndex];
        const wasCompletedBefore = todo.completed;
        
        // Обновляем статус задачи
        todo.completed = isCompleted;
        
        // Если задача была отмечена как выполненная (и не была выполнена ранее)
        if (isCompleted && !wasCompletedBefore) {
            // Получаем XP в зависимости от размера задачи
            const xpAmount = getXpForTodoSize(todo.size);
            
            // Обновляем XP локально перед сохранением
            const currentXp = currentUser.xp || 0;
            currentUser.xp = currentXp + xpAmount;
            
            // Сохраняем все изменения (включая статус задачи и обновленный XP)
            saveUserData()
                .then(() => {
                    // Показываем уведомление
                    showNotification(`Задача выполнена! +${xpAmount} XP`, 'success');
                    
                    // Показываем конфетти
                    showConfetti();
                    
                    // Обновляем отображение задач
                    renderTodoItems();
                })
                .catch(error => {
                    console.error('Ошибка при обновлении задачи:', error);
                    showNotification('Ошибка при обновлении задачи: ' + error.message, 'error');
                    
                    // Восстанавливаем статус задачи и XP
                    todo.completed = wasCompletedBefore;
                    currentUser.xp = currentXp;
                    renderTodoItems();
                });
        } else {
            // Сохраняем обновленные данные
            saveUserData()
                .then(() => {
                    // Обновляем отображение задач
                    renderTodoItems();
                })
                .catch(error => {
                    console.error('Ошибка при сохранении данных:', error);
                    showNotification('Ошибка при обновлении задачи: ' + error.message, 'error');
                    
                    // Восстанавливаем статус задачи
                    todo.completed = wasCompletedBefore;
                    renderTodoItems();
                });
        }
    }
    
    function deleteTodoItem(todoId) {
        // Сохраняем копию задач перед удалением
        const originalTodos = [...currentUser.todos];
        
        // Удаляем задачу из массива
        currentUser.todos = currentUser.todos.filter(todo => todo.id !== todoId);
        
        // Сохраняем обновленные данные
        saveUserData()
            .then(() => {
                // Обновляем отображение задач
                renderTodoItems();
                
                // Показываем уведомление
                showNotification('Задача удалена', 'info');
            })
            .catch(error => {
                console.error('Ошибка при удалении задачи:', error);
                showNotification('Ошибка при удалении задачи: ' + error.message, 'error');
                
                // Восстанавливаем оригинальный список задач в случае ошибки
                currentUser.todos = originalTodos;
                renderTodoItems();
            });
    }
    
    function getXpForTodoSize(size) {
        switch (size) {
            case 'small': return 10;
            case 'medium': return 25;
            case 'large': return 50;
            default: return 10;
        }
    }
    
    async function saveUserData() {
        return new Promise(async (resolve, reject) => {
            try {
                console.log('Сохранение данных пользователя:', JSON.stringify(currentUser));
                console.log('URL запроса для получения данных:', `${API_URL}/user/${currentUser.username}`);
                
                // Сначала получаем актуальные данные с сервера
                const getResponse = await fetch(`${API_URL}/user/${currentUser.username}`);
                console.log('Статус ответа получения данных:', getResponse.status);
                
                if (!getResponse.ok) {
                    throw new Error('Не удалось получить актуальные данные пользователя');
                }
                
                const serverData = await getResponse.json();
                console.log('Актуальные данные с сервера:', serverData);
                
                // Объединяем данные с сервера и клиента, приоритет отдаем клиентским данным
                const updatedData = {
                    ...serverData,
                    ...currentUser
                };
                
                console.log('Данные для отправки на сервер:', updatedData);
                console.log('URL запроса для обновления:', `${API_URL}/user/${currentUser.username}`);
                
                const response = await fetch(`${API_URL}/user/${currentUser.username}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedData)
                });
                
                console.log('Статус ответа:', response.status);
                const responseText = await response.text();
                console.log('Текст ответа:', responseText);
                
                if (!response.ok) {
                    let errorMessage = 'Ошибка сохранения данных';
                    try {
                        const errorData = JSON.parse(responseText);
                        errorMessage = errorData.message || errorMessage;
                    } catch (e) {
                        console.error('Ошибка при парсинге ответа:', e);
                    }
                    throw new Error(errorMessage);
                }
                
                try {
                    const responseData = JSON.parse(responseText);
                    console.log('Данные успешно сохранены:', responseData);
                    
                    // Обновляем локальные данные пользователя
                    currentUser = responseData;
                    
                    // Обновление интерфейса
                    updateUI();
                    
                    resolve(responseData);
                } catch (e) {
                    console.error('Ошибка при парсинге данных ответа:', e);
                    reject(new Error('Ошибка при обработке ответа сервера'));
                }
                
            } catch (error) {
                console.error('Ошибка сохранения данных:', error);
                // Не показываем уведомление здесь, а передаем ошибку вызывающему коду
                reject(error);
            }
        });
    }
});
