# Настройка базы данных MongoDB для проекта "Геймификация жизни"

В этом руководстве описан процесс настройки MongoDB для локальной разработки и тестирования проекта.

## Требования

- [MongoDB](https://www.mongodb.com/try/download/community) (версия 4.4 или выше)
- [MongoDB Compass](https://www.mongodb.com/try/download/compass) (опционально, для визуализации данных)
- Node.js (версия 16 или выше)
- npm или yarn

## Установка MongoDB

### Windows

1. Загрузите установщик MongoDB Community Edition с [официального сайта](https://www.mongodb.com/try/download/community)
2. Запустите установщик и следуйте инструкциям
3. Выберите опцию "Complete" для установки всех компонентов
4. Установите MongoDB Compass для визуализации данных
5. После установки MongoDB запускается как служба Windows

### macOS

```bash
# Установка через Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Запуск MongoDB
brew services start mongodb-community
```

### Linux (Ubuntu)

```bash
# Добавление репозитория MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list

# Установка MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Запуск MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

## Настройка проекта

1. Клонируйте репозиторий проекта:
```bash
git clone https://github.com/yourusername/habit-game.git
cd habit-game
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env` в корне проекта со следующими переменными:
```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/habit-game
MONGODB_TEST_URI=mongodb://localhost:27017/habit-game-test
JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=30d
```

## Инициализация базы данных

Для инициализации базы данных с начальными данными выполните команду:

```bash
npm run seed
```

или

```bash
yarn seed
```

Эта команда создаст:
- Начальные достижения
- Тестового администратора (в режиме разработки)

## Структура базы данных

Проект использует следующие коллекции:

1. `users` - Пользователи системы
2. `habits` - Привычки пользователей
3. `tasks` - Задачи пользователей
4. `achievements` - Глобальные достижения
5. `userAchievements` - Связь между пользователями и достижениями

## Использование MongoDB Compass

1. Запустите MongoDB Compass
2. Подключитесь к локальной базе данных: `mongodb://localhost:27017`
3. Выберите базу данных `habit-game`
4. Просматривайте и редактируйте коллекции через графический интерфейс

## Работа с тестовой базой данных

Для тестов приложение использует отдельную базу данных `habit-game-test`.

При запуске тестов:
1. Создается подключение к тестовой базе данных
2. Перед каждым тестом база очищается
3. После завершения тестов подключение закрывается

## Решение проблем

### MongoDB не запускается

1. Проверьте статус службы MongoDB:
   - Windows: `services.msc` → найдите MongoDB
   - macOS: `brew services list`
   - Linux: `sudo systemctl status mongod`

2. Проверьте логи MongoDB:
   - Windows: `C:\Program Files\MongoDB\Server\4.4\log\mongod.log`
   - macOS: `/usr/local/var/log/mongodb/mongo.log`
   - Linux: `/var/log/mongodb/mongod.log`

3. Убедитесь, что порт 27017 не занят другим приложением:
   - Windows: `netstat -ano | findstr 27017`
   - macOS/Linux: `sudo lsof -i :27017`

### Проблемы с подключением к БД в приложении

1. Проверьте правильность переменных окружения в файле `.env`
2. Убедитесь, что MongoDB запущена и доступна по адресу `localhost:27017`
3. Проверьте логи приложения на наличие ошибок подключения

## Дополнительная информация

- [Официальная документация MongoDB](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/guide.html) 