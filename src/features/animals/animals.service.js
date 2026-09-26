// Business logic / Validation / Pagination
const { pool } = require('../../db/pool');

const getAnimalImage = (animal = {}) => {
    // If animal.image is a valid URL string, return it directly.
    if (animal.image && typeof animal.image === 'string') {
        return animal.image;
    }

    // If no valid image is provided, return a fallback Unsplash image based on the animal type.
    const type = (animal.animal_type || animal.type || 'animal').toLowerCase();

    const fallbackImages = {
        dog: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80',
        cat: 'https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=900&q=80',
        bird: 'https://images.unsplash.com/photo-1444464666166-8c4f4bb9f4a2?auto=format&fit=crop&w=900&q=80',
        horse: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=900&q=80'
    };

    return fallbackImages[type] || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80';
};

const addImageToAnimal = (animal = {}) => ({
    ...animal,
    image: getAnimalImage(animal)
});

// Function to retrieve all animals from the database with pagination
const findAllAnimals = async ({ page, limit, offset }) => {
    const dataQuery = `
        SELECT a.external_id, a.name, a.date_of_birth, a.outcome_datetime, a.age_outcome_days, at.name AS animal_type, ot.name AS outcome_type, a.outcome_subtype, a.sex, a.is_intact, a.breed, a.color
        FROM animals a
        LEFT JOIN animal_types at ON a.animal_type_id = at.id
        LEFT JOIN outcome_types ot ON a.outcome_type_id = ot.id
        ORDER BY a.external_id ASC
        LIMIT $1 OFFSET $2                  -- LIMIT = how many rows to return, OFFSET = which row to start from
    `;
    const resultDataQuery = await pool.query(dataQuery, [limit, offset]);
    const data = (resultDataQuery.rows || []).map(addImageToAnimal);

    const countQuery = `
        SELECT COUNT(*) AS total
        FROM animals a
    `;
    const resultCountQuery = await pool.query(countQuery);
    const countRows = resultCountQuery.rows;
    const totalRows = countRows[0].total;

    const totalPages = Math.max(1, Math.ceil(totalRows / limit));

    return { data, pagination: { page, limit, offset, totalRows, totalPages, hasPrevious: page > 1, hasNext: page < totalPages } };
};

// Function to retrieve a specific animal by its ID from the database
const findAnimalById = async (id) => {
    // Accept either numeric primary `id` or string `external_id` (e.g., A134067)
    const isNumeric = /^\d+$/.test(String(id));

    const query = `
        SELECT a.external_id, a.name, a.date_of_birth, a.outcome_datetime, a.age_outcome_days, at.name AS animal_type, ot.name AS outcome_type, a.outcome_subtype, a.sex, a.is_intact, a.breed, a.color
        FROM animals a
        LEFT JOIN animal_types at ON a.animal_type_id = at.id
        LEFT JOIN outcome_types ot ON a.outcome_type_id = ot.id
        WHERE ${isNumeric ? 'a.id = $1' : 'a.external_id = $1'}
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] ? addImageToAnimal(result.rows[0]) : null;
};

const createAnimalService = async (animalData) => {
    const { external_id, name, date_of_birth, outcome_datetime, age_outcome_days, animal_type_id, outcome_type_id, outcome_subtype, sex, is_intact, breed, color } = animalData;

    const query = `
        INSERT INTO animals (external_id, name, date_of_birth, outcome_datetime, age_outcome_days, animal_type_id, outcome_type_id, outcome_subtype, sex, is_intact, breed, color)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
    `;
    const result = await pool.query(query, [external_id, name, date_of_birth, outcome_datetime, age_outcome_days, animal_type_id, outcome_type_id, outcome_subtype, sex, is_intact, breed, color]);
    return result.rows[0];
};

const updateAnimalService = async (id, animalData) => {
    const { name, date_of_birth, outcome_datetime, age_outcome_days } = animalData;
    const isNumeric = /^\d+$/.test(String(id));

    const query = `
        UPDATE animals
        SET name = $1, date_of_birth = $2, outcome_datetime = $3, age_outcome_days = $4
        WHERE ${isNumeric ? 'id = $5' : 'external_id = $5'}
        RETURNING *
    `;
    const result = await pool.query(query, [name, date_of_birth, outcome_datetime, age_outcome_days, id]);
    return result.rows[0];
};

const deleteAnimalService = async (id) => {
    const isNumeric = /^\d+$/.test(String(id));

    const query = `
        DELETE FROM animals
        WHERE ${isNumeric ? 'id = $1' : 'external_id = $1'}
        RETURNING *
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

// Reference data for the "create animal" form on the dashboard
const findAnimalTypes = async () => {
    const result = await pool.query('SELECT id, name FROM animal_types ORDER BY name ASC');
    return result.rows;
};

const findOutcomeTypes = async () => {
    const result = await pool.query('SELECT id, name FROM outcome_types ORDER BY name ASC');
    return result.rows;
};

module.exports = { findAllAnimals, findAnimalById, createAnimalService, updateAnimalService, deleteAnimalService, findAnimalTypes, findOutcomeTypes };