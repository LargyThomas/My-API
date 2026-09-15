const { createClient } = require('redis');

const redisClient = createClient({
    url: 'redis://localhost:6379'
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

// IIFE (Immediately Invoked Function Expression) to connect to Redis
(async () => {
    try {
        await redisClient.connect();
        console.log('Connected to Valkey');
    } catch (error) {
        console.error('Valkey connection failed:', error.message);
    }
})();

module.exports = redisClient;
