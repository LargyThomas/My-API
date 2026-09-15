// Receive the request / call service / send response
const redisClient = require('../../cache/redis');
const { findAllAnimals, findAnimalById, createAnimalService, updateAnimalService, deleteAnimalService } = require('./animals.service');

// Function to parse pagination parameters from the request query
function parsePagination(query) {
    const MAX_LIMIT = 20;

    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(query.limit, 10) || MAX_LIMIT));
    const offset = (page - 1) * limit;

    return { page, limit, offset };
}

const buildAnimalsCacheKey = ({ page, limit }) => `animals:page=${page}:limit=${limit}`;

// Controller function to handle the request for retrieving all animals
const allAnimals = async (req, res) => {
    try {
        const { page, limit, offset } = parsePagination(req.query);
        const cacheKey = buildAnimalsCacheKey({ page, limit });

        const cached = await redisClient.get(cacheKey);

        if (cached) {
            const parsedCache = JSON.parse(cached);
            return res.status(200).json({ message: 'Animals information has been recovered from cache.', data: parsedCache.data, pagination: parsedCache.pagination });
        }

        const result = await findAllAnimals({ page, limit, offset });

        if (!result.data.length) {
            return res.status(404).json({ message: 'No animals were found.' });
        }

        await redisClient.set(cacheKey, JSON.stringify(result), { EX: 30 });

        return res.status(200).json({ message: 'Animals information has been recovered.', data: result.data, pagination: result.pagination });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error server. Please try again later.' });
    }
};

// Controller function to handle the request for retrieving a specific animal by its ID
const getAnimalById = async (req, res) => {
    try {
        const animal = await findAnimalById(req.params.id);

        if (!animal) {
            return res.status(404).json({ message: 'This animal is no longer with us.' });
        }

        return res.status(200).json({ message: 'Animal information from this id has been recovered.', data: animal });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error server. Please try again later.' });
    }
};

// Controller function to handle the request for creating a new animal
const createAnimal = async (req, res) => {
    try {
        const newAnimal = await createAnimalService(req.body);

        const cacheKeys = await redisClient.keys('animals:*');
        if (cacheKeys.length > 0) {
            await redisClient.del(cacheKeys);
        }

        return res.status(201).json({ message: 'Animal created successfully.', data: newAnimal });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error server. Please try again later.' });
    }
};

// Controller function to handle the request for updating an existing animal
const updateAnimal = async (req, res) => {
    try {
        const updatedAnimal = await updateAnimalService(req.params.id, req.body);

        const cacheKeys = await redisClient.keys('animals:*');
        if (cacheKeys.length > 0) {
            await redisClient.del(cacheKeys);
        }

        return res.status(200).json({ message: 'Animal updated successfully.', data: updatedAnimal });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error server. Please try again later.' });
    }
};

// Controller function to handle the request for deleting an existing animal
const deleteAnimal = async (req, res) => {
    try {
        const deletedAnimal = await deleteAnimalService(req.params.id);

        const cacheKeys = await redisClient.keys('animals:*');
        if (cacheKeys.length > 0) {
            await redisClient.del(cacheKeys);
        }

        return res.status(200).json({ message: 'Animal deleted successfully.', data: deletedAnimal });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error server. Please try again later.' });
    }
};

module.exports = { allAnimals, getAnimalById, createAnimal, updateAnimal, deleteAnimal };