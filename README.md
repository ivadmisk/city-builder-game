# City Empire Game

Многопользовательская игра по строительству городов с использованием React, Node.js и MongoDB.

## Требования

- Node.js 14+ и npm
- MongoDB 4.4+
- Modern web browser

## Установка

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd city-empire-game
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл .env в корневой директории проекта со следующим содержимым:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/city-empire
JWT_SECRET=your-super-secret-key-change-in-production
CLIENT_URL=http://localhost:3000
```

4. Убедитесь, что MongoDB запущена и доступна.

## Запуск

1. Запуск сервера разработки (бэкенд):
```bash
npm run dev:server
```

2. В другом терминале запустите клиент (фронтенд):
```bash
npm run dev:client
```

3. Откройте http://localhost:3000 в браузере

## Сборка для продакшена

```bash
npm run build
```

## Основные функции

- Регистрация и аутентификация пользователей
- Создание и управление городами
- Система ресурсов (золото, дерево, камень, еда)
- Строительство и улучшение зданий
- Управление населением
- Реальное время с использованием WebSocket

## Технологии

- Frontend:
  - React
  - Material-UI
  - Three.js (для 3D графики)
  - Socket.IO Client
  - TypeScript

- Backend:
  - Node.js + Express
  - MongoDB + Mongoose
  - Socket.IO
  - JWT для аутентификации
  - TypeScript

## Структура проекта

```
city-empire-game/
├── src/
│   ├── client/           # Frontend React приложение
│   │   ├── components/   # React компоненты
│   │   └── App.tsx      # Главный компонент
│   └── server/          # Backend Express приложение
│       ├── models/      # Mongoose модели
│       ├── routes/      # Express маршруты
│       └── index.ts     # Точка входа сервера
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Разработка

1. Создайте ветку для новой функции:
```bash
git checkout -b feature/your-feature-name
```

2. Внесите изменения и закоммитьте:
```bash
git add .
git commit -m "Add your feature"
```

3. Отправьте изменения и создайте Pull Request:
```bash
git push origin feature/your-feature-name
```

## Лицензия

ISC 