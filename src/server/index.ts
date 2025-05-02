import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { config } from 'dotenv';

// Загружаем переменные окружения
dotenv.config();
config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Подключение к MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://your-mongodb-uri';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Подключено к MongoDB Atlas'))
  .catch(err => console.error('❌ Ошибка подключения к MongoDB:', err));

// Роуты
import authRoutes from './routes/auth';
import cityRoutes from './routes/cities';

app.use('/api/auth', authRoutes);
app.use('/api/cities', cityRoutes);

// Раздача статических файлов
app.use(express.static(path.join(__dirname, '../../dist/client')));

// WebSocket события
io.on('connection', (socket) => {
  console.log('👤 Новое подключение:', socket.id);

  socket.on('disconnect', () => {
    console.log('👋 Отключение:', socket.id);
  });

  // Здесь будет добавлена игровая логика
});

// Эндпоинт проверки здоровья для Render.com
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Все остальные запросы направляем на React приложение
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/client/index.html'));
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
}); 