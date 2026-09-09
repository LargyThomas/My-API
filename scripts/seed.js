// Import the required modules
const fs = require('fs');
const { parse } = require('csv-parse/sync');
const { Client } = require('pg');
require('dotenv').config();

// Configurate the PostgreSQL client with environment variables
const client = new Client ({
    host : process.env.PG_HOST,
    port : process.env.PG_PORT,
    database : process.env.PG_DATABASE,
    user : process.env.PG_USER,
    password : process.env.PG_PASSWORD
});

// Function to read CSV file and return its content as an array of objects
function readCsv(path) {
    const content = fs.readFileSync(path, 'utf-8');
    return parse(content, {
        columns: true,
        skip_empty_lines: true
    });
}

// Function to seed a reference table with names and return a Map of name to id
async function seedReferenceTable(tableName, names) {
    const map = new Map();
    for (const name of names) {
        if (!name) continue;
        const result = await client.query(                          // ON CONFLICT ensure the uniqueness of the name and update it if it already exists
            `INSERT INTO ${tableName} (name) VALUES ($1)
            ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
            RETURNING id`,
            [name]
        );
        map.set(name, result.rows[0].id);                           // result.rows return 1 line with the id of the inserted/updated name
    }
    return map;
}

// Function to insert animals into the database
async function seedAnimals(animalsData, animalTypeMap, outcomeTypeMap) {
    // Start a transaction to ensure all inserts are treated as a single unit of work
    await client.query('BEGIN');

    for (const row of animalsData) {
        await client.query(
            `INSERT INTO animals (external_id, name, date_of_birth, outcome_datetime, age_outcome_days, animal_type_id, outcome_type_id, outcome_subtype, sex, is_intact, breed, color)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
             ON CONFLICT (external_id) DO NOTHING`,
            [
                row.external_id,
                row.name || null,
                row.date_of_birth || null,
                row.outcome_datetime,
                row.age_outcome_days ? Math.round(parseFloat(row.age_outcome_days)) : null,
                animalTypeMap.get(row.animal_type) || null,
                outcomeTypeMap.get(row.outcome_type) || null,
                row.outcome_subtype || null,
                row.sex,
                row.is_intact === '' ? null : row.is_intact === 'true',
                row.breed,
                row.color
            ]
        );
    }

    // Commit the transaction to save all changes to the database
    await client.query('COMMIT');
    console.log(`${animalsData.length} animaux insérés`);
}

async function main() {
    try {
        await client.connect();

        // Read the CSV files and parse them into arrays of objects
        const animalTypesData = readCsv('data/animal_types.csv');
        const outcomeTypesData = readCsv('data/outcome_types.csv');
        const animalsData = readCsv('data/animals_clean.csv').slice(0, 5000);

        // Extract the 'name' column into arrays of strings
        const namesAnimalTypes = animalTypesData.map(row => row.name);
        const namesOutcomeTypes = outcomeTypesData.map(row => row.name);

        // Seed the tables and keep the returned Maps
        const animalTypeMap = await seedReferenceTable('animal_types', namesAnimalTypes);
        const outcomeTypeMap = await seedReferenceTable('outcome_types', namesOutcomeTypes);

        // Insert the animals
        await seedAnimals(animalsData, animalTypeMap, outcomeTypeMap);

        await client.end();

    } catch (error) {
        console.error(' Error:', error);
        // Ensure the client is closed even if an error occurs
        if (client) await client.end();
    }
}

main();