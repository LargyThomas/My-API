// Import the required modules
const fs = require('fs');
const csv = require('csv-parse');
const { Client } = require('pg');
require('dotenv').config();

// Configurate the PostgreSQL client with environment variables
const client = new Client ({
    host : process.env.HOST,
    port : process.env.PORT,
    database : process.env.DATABASE,
    user : process.env.USER,
    password : process.env.PASSWORD
});

// Function to read CSV file and return its content as an array of objects
function readCsv(path) {
    const content = fs.readFileSync(path, 'utf-8');
    return csv.parse(content, {
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

async function main() {
    try {
        await client.connect();
        console.log('Connected to the database');

        // Read the CSV files and parse them into arrays of objects
        const animalTypesData = readCsv('data/animal_types.csv');
        const outcomeTypesData = readCsv('data/outcome_types.csv');

        // Extract the 'name' column into arrays of strings
        const namesAnimalTypes = animalTypesData.map(row => row.name);
        const namesOutcomeTypes = outcomeTypesData.map(row => row.name);

        // Seed the tables and keep the returned Maps
        const animalTypeMap = await seedReferenceTable('animal_types', namesAnimalTypes);
        const outcomeTypeMap = await seedReferenceTable('outcome_types', namesOutcomeTypes);

        // Display the results to verify everything worked
        console.log('\n Animal Types Map (Name -> ID):');
        console.log(animalTypeMap);

        console.log('\n Outcome Types Map (Name -> ID):');
        console.log(outcomeTypeMap);

        // Disconnect from the database
        await client.end();
        console.log('\n Disconnected from the database');

    } catch (error) {
        console.error(' Error:', error);
        // Ensure the client is closed even if an error occurs
        if (client) await client.end();
    }
}

main();