#!/bin/bash

# Переходим в директорию проекта
cd "$(dirname "$0")"

# Устанавливаем зависимости, если они еще не установлены
echo "📦 Устанавливаем зависимости..."
npm install

# Создаем .env файл, если его нет
if [ ! -f .env ]; then
    echo "🔧 Создаем конфигурационный файл..."
    # Генерируем случайный JWT_SECRET
    JWT_SECRET=$(openssl rand -base64 32)
    echo "PORT=5000
MONGODB_URI=mongodb://localhost:27017/city-empire
JWT_SECRET=$JWT_SECRET
CLIENT_URL=http://localhost:3000" > .env
fi

# Проверяем, установлена ли MongoDB
if ! command -v mongod &> /dev/null; then
    echo "❌ MongoDB не установлена. Пожалуйста, установите MongoDB и попробуйте снова."
    echo "Инструкции по установке: https://docs.mongodb.com/manual/installation/"
    exit 1
fi

# Проверяем статус MongoDB
echo "🚀 Проверяем MongoDB..."
if ! pgrep -x "mongod" > /dev/null; then
    echo "Запускаем MongoDB..."
    if [ -d "/usr/local/var/mongodb" ]; then
        mongod --dbpath /usr/local/var/mongodb --fork --logpath /dev/null
    else
        echo "Создаем директорию для данных MongoDB..."
        sudo mkdir -p /usr/local/var/mongodb
        sudo chown $(whoami) /usr/local/var/mongodb
        mongod --dbpath /usr/local/var/mongodb --fork --logpath /dev/null
    fi
fi

# Инициализируем базу данных тестовыми данными
echo "🗄️ Инициализируем базу данных..."
node init-db.js

# Запускаем сервер в фоновом режиме
echo "🌐 Запускаем сервер..."
npm run dev:server &
SERVER_PID=$!

# Ждем 5 секунд, чтобы сервер успел запуститься
sleep 5

# Запускаем клиент
echo "💻 Запускаем клиент..."
npm run dev:client &
CLIENT_PID=$!

# Выводим информацию
echo "
✨ Игра запущена! ✨
🌍 Откройте http://localhost:3000 в браузере
👤 Тестовый пользователь:
   Email: test@example.com
   Пароль: password123

❌ Чтобы остановить игру, нажмите Ctrl+C
"

# Функция очистки при выходе
cleanup() {
    echo "
🛑 Останавливаем сервисы..."
    kill $SERVER_PID $CLIENT_PID
    exit
}

# Регистрируем функцию очистки
trap cleanup INT TERM

wait 