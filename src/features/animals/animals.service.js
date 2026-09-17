// Business logic / Validation / Pagination
const { pool } = require('../../db/pool');

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
    const data = resultDataQuery.rows;

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
    return result.rows[0] || null;
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

    const query = `
        UPDATE animals
        SET name = $1, date_of_birth = $2, outcome_datetime = $3, age_outcome_days = $4
        WHERE id = $5
        RETURNING *
    `;
    const result = await pool.query(query, [name, date_of_birth, outcome_datetime, age_outcome_days, id]);
    return result.rows[0];
};

const deleteAnimalService = async (id) => {
    const query = `
        DELETE FROM animals
        WHERE id = $1
        RETURNING *
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

module.exports = { findAllAnimals, findAnimalById, createAnimalService, updateAnimalService, deleteAnimalService };