const { createClient } = require('redis');

const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

// IIFE (Immediately Invoked Function Expression) to connect to Redis
(async () => {
    try {
        await redisClient.connect();
        console.log('Connected to Redis successfully.');
    } catch (error) {
        console.error('Valkey connection failed:', error.message);
    }
})();

module.exports = redisClient;
