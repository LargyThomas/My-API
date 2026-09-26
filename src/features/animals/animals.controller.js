const redisClient = require('../../cache/redis');
const { findAllAnimals, findAnimalById, createAnimalService, updateAnimalService, deleteAnimalService, findAnimalTypes, findOutcomeTypes } = require('./animals.service');

const MAX_LIMIT = 20;

// Reads and normalizes page/limit/offset from the query string
function parsePagination(query) {
	const page = Math.max(1, parseInt(query.page, 10) || 1);
	const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(query.limit, 10) || MAX_LIMIT));
	const offset = (page - 1) * limit;

	return { page, limit, offset };
}

// Builds the Redis cache key for a given page
const buildAnimalsCacheKey = ({ page, limit }) => `animals:page=${page}:limit=${limit}`;

// Vide tout le cache des listes d'animaux (appelé après chaque création/modif/suppression)
async function invalidateAnimalsCache() {
	const cacheKeys = await redisClient.keys('animals:*');
	if (cacheKeys.length > 0) {
		await redisClient.del(cacheKeys);
	}
}

// Retrieves the paginated list of animals, from the cache if possible
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

// Retrieves a specific animal by its ID or external_id
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

// Create a new animal
const createAnimal = async (req, res) => {
	try {
		const newAnimal = await createAnimalService(req.body);
		await invalidateAnimalsCache();

		return res.status(201).json({ message: 'Animal created successfully.', data: newAnimal });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Error server. Please try again later.' });
	}
};

// Updates an existing animal
const updateAnimal = async (req, res) => {
	try {
		const updatedAnimal = await updateAnimalService(req.params.id, req.body);
		await invalidateAnimalsCache();

		return res.status(200).json({ message: 'Animal updated successfully.', data: updatedAnimal });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Error server. Please try again later.' });
	}
};

// Delete an animal
const deleteAnimal = async (req, res) => {
	try {
		const deletedAnimal = await deleteAnimalService(req.params.id);
		await invalidateAnimalsCache();

		return res.status(200).json({ message: 'Animal deleted successfully.', data: deletedAnimal });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Error server. Please try again later.' });
	}
};

// Provides lists of animal types and event types (for the dashboard form)
const getAnimalTypes = async (req, res) => {
	try {
		const [animalTypes, outcomeTypes] = await Promise.all([findAnimalTypes(), findOutcomeTypes()]);
		return res.status(200).json({ animalTypes, outcomeTypes });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Error server. Please try again later.' });
	}
};

module.exports = { allAnimals, getAnimalById, createAnimal, updateAnimal, deleteAnimal, getAnimalTypes };