#!/bin/bash

# Сборка клиента
echo "📦 Сборка клиента..."
npm run build:client

# Сборка сервера
echo "📦 Сборка сервера..."
npm run build:server

# Создание Dockerfile
echo "🐳 Создание Dockerfile..."
cat > Dockerfile << 'EOL'
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY dist ./dist
COPY .env ./

RUN npm install --production

EXPOSE 5000

CMD ["npm", "start"]
EOL

# Создание render.yaml
echo "📝 Создание конфигурации Render..."
cat > render.yaml << 'EOL'
services:
  - type: web
    name: city-empire
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5000
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        generateValue: true
EOL

echo "✅ Готово!"
echo "
Для деплоя на Render.com:
1. Создайте бесплатную базу данных MongoDB Atlas:
   https://www.mongodb.com/cloud/atlas/register
   
2. Создайте новый Web Service на Render.com:
   https://dashboard.render.com/select-repo?type=web
   
3. Укажите переменные окружения в Render Dashboard:
   - MONGODB_URI: строка подключения из MongoDB Atlas
   - JWT_SECRET: будет сгенерирован автоматически
   
4. Нажмите Deploy и дождитесь завершения развертывания
   
После деплоя игра будет доступна по URL вида:
https://city-empire.onrender.com" 