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
        LEFT JOIN animal_types at ON a.animal_type_id = at.id
        LEFT JOIN outcome_types ot ON a.outcome_type_id = ot.id
    `;
    const resultCountQuery = await pool.query(countQuery);
    const countRows = resultCountQuery.rows;
    const totalRows = countRows[0].total;

    const totalPages = Math.max(1, Math.ceil(totalRows / limit));

    return { data, pagination: { page, limit, offset, totalRows, totalPages, hasPrevious: page > 1, hasNext: page < totalPages } };
};

module.exports = { findAllAnimals };