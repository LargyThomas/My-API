const { createClient } = require('redis');

const redisClient = createClient({
	url: process.env.REDIS_URL
});

redisClient.on('error', (err) => {
	console.error('Redis error:', err);
});

// IIFE : connects to Redis as soon as the module loads
(async () => {
	try {
		await redisClient.connect();
		console.log('Connected to Redis successfully.');
	} catch (error) {
		console.error('Redis connection failed:', error.message);
	}
})();

module.exports = redisClient;