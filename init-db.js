const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function initDB() {
    const client = new MongoClient('mongodb://localhost:27017');
    
    try {
        await client.connect();
        console.log('✅ Подключено к MongoDB');
        
        const db = client.db('city-empire');
        
        // Очищаем коллекции
        await db.collection('users').deleteMany({});
        await db.collection('cities').deleteMany({});
        
        // Создаем тестового пользователя
        const hashedPassword = await bcrypt.hash('password123', 10);
        const user = {
            username: 'test',
            email: 'test@example.com',
            password: hashedPassword,
            cities: [],
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        await db.collection('users').insertOne(user);
        console.log('✅ Тестовый пользователь создан');
        console.log('📧 Email: test@example.com');
        console.log('🔑 Пароль: password123');
        
    } catch (error) {
        console.error('❌ Ошибка:', error);
    } finally {
        await client.close();
    }
}

initDB().catch(console.error); 