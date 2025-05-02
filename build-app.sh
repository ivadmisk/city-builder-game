#!/bin/bash

# Создаем структуру .app
APP_NAME="City Empire.app"
CONTENTS_DIR="$APP_NAME/Contents"
MACOS_DIR="$CONTENTS_DIR/MacOS"
RESOURCES_DIR="$CONTENTS_DIR/Resources"

mkdir -p "$MACOS_DIR"
mkdir -p "$RESOURCES_DIR"

# Копируем иконку
cat > "$RESOURCES_DIR/game.icns" << 'EOL'
icns
EOL

# Создаем Info.plist
cat > "$CONTENTS_DIR/Info.plist" << 'EOL'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>game-launcher</string>
    <key>CFBundleIconFile</key>
    <string>game.icns</string>
    <key>CFBundleIdentifier</key>
    <string>com.cityempire.game</string>
    <key>CFBundleName</key>
    <string>City Empire</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0</string>
    <key>LSMinimumSystemVersion</key>
    <string>10.10</string>
    <key>NSHighResolutionCapable</key>
    <true/>
</dict>
</plist>
EOL

# Создаем launcher скрипт
cat > "$MACOS_DIR/game-launcher" << 'EOL'
#!/bin/bash

# Получаем путь к директории приложения
APP_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
RESOURCES_DIR="$APP_DIR/../Resources"
GAME_DIR="$RESOURCES_DIR/game"

# Проверяем MongoDB
if ! command -v mongod &> /dev/null; then
    osascript -e 'display dialog "MongoDB не установлена. Установите MongoDB Community Edition:\n\nhttps://www.mongodb.com/try/download/community" buttons {"OK"} default button "OK" with icon caution with title "City Empire"'
    open "https://www.mongodb.com/try/download/community"
    exit 1
fi

# Запускаем MongoDB
if ! pgrep -x "mongod" > /dev/null; then
    if [ ! -d "/usr/local/var/mongodb" ]; then
        mkdir -p "/usr/local/var/mongodb"
    fi
    mongod --dbpath /usr/local/var/mongodb --fork --logpath /dev/null
fi

# Переходим в директорию игры
cd "$GAME_DIR"

# Проверяем наличие Node.js
if ! command -v node &> /dev/null; then
    osascript -e 'display dialog "Node.js не установлен. Установите Node.js:\n\nhttps://nodejs.org/" buttons {"OK"} default button "OK" with icon caution with title "City Empire"'
    open "https://nodejs.org/"
    exit 1
fi

# Устанавливаем зависимости, если необходимо
if [ ! -d "node_modules" ]; then
    npm install
fi

# Инициализируем базу данных
node init-db.js

# Запускаем сервер
npm run dev:server &
SERVER_PID=$!

# Ждем запуска сервера
sleep 2

# Запускаем клиент
npm run dev:client &
CLIENT_PID=$!

# Открываем браузер
sleep 2
open http://localhost:3000

# Функция очистки при выходе
cleanup() {
    kill $SERVER_PID $CLIENT_PID 2>/dev/null
    exit 0
}

# Регистрируем функцию очистки
trap cleanup INT TERM

# Показываем уведомление
osascript -e 'display notification "Игра запущена! Откройте http://localhost:3000 в браузере" with title "City Empire"'

# Ждем завершения процессов
wait
EOL

# Делаем launcher исполняемым
chmod +x "$MACOS_DIR/game-launcher"

# Копируем файлы игры
mkdir -p "$RESOURCES_DIR/game"
cp -r * "$RESOURCES_DIR/game/"
rm -rf "$RESOURCES_DIR/game/$APP_NAME"

echo "✅ Приложение создано: $APP_NAME"
echo "👉 Перетащите $APP_NAME в папку Applications для установки" 