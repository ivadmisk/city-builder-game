# Build stage
FROM node:16-alpine as builder

WORKDIR /app

# Копируем файлы package.json
COPY package*.json ./
COPY src/client/package*.json ./src/client/

# Устанавливаем зависимости
RUN npm install
RUN cd src/client && npm install

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Production stage
FROM node:16-alpine

WORKDIR /app

# Копируем собранные файлы и зависимости
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

# Открываем порт
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "start"] 