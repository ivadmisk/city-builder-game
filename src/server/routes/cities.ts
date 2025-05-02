import express from 'express';
import { City } from '../models/City';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware для проверки аутентификации
const auth = async (req: any, res: any, next: any) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-key') as { userId: string };
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Пожалуйста, авторизуйтесь' });
  }
};

// Получить все города пользователя
router.get('/my', auth, async (req: any, res) => {
  try {
    const cities = await City.find({ owner: req.user._id });
    res.json(cities);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении городов' });
  }
});

// Создать новый город
router.post('/', auth, async (req: any, res) => {
  try {
    const { name } = req.body;

    const city = new City({
      name,
      owner: req.user._id
    });

    await city.save();

    // Добавляем город в список городов пользователя
    req.user.cities.push(city._id);
    await req.user.save();

    res.status(201).json(city);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при создании города' });
  }
});

// Получить информацию о конкретном городе
router.get('/:id', auth, async (req: any, res) => {
  try {
    const city = await City.findOne({ _id: req.params.id, owner: req.user._id });
    if (!city) {
      return res.status(404).json({ error: 'Город не найден' });
    }
    res.json(city);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении информации о городе' });
  }
});

// Обновить ресурсы города
router.patch('/:id/resources', auth, async (req: any, res) => {
  try {
    const { resources } = req.body;
    const city = await City.findOne({ _id: req.params.id, owner: req.user._id });

    if (!city) {
      return res.status(404).json({ error: 'Город не найден' });
    }

    city.resources = { ...city.resources, ...resources };
    await city.save();

    res.json(city);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при обновлении ресурсов' });
  }
});

// Добавить здание в город
router.post('/:id/buildings', auth, async (req: any, res) => {
  try {
    const { type, position } = req.body;
    const city = await City.findOne({ _id: req.params.id, owner: req.user._id });

    if (!city) {
      return res.status(404).json({ error: 'Город не найден' });
    }

    city.buildings.push({
      type,
      level: 1,
      position
    });

    await city.save();
    res.status(201).json(city);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при добавлении здания' });
  }
});

export default router; 