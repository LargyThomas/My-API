const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL connection pool, shared by the entire application
const pool = new Pool({
	host: process.env.PG_HOST,
	port: process.env.PG_PORT ? parseInt(process.env.PG_PORT, 10) : undefined,
	database: process.env.PG_DATABASE,
	user: process.env.PG_USER,
	password: process.env.PG_PASSWORD ? String(process.env.PG_PASSWORD) : undefined,
	ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

module.exports = { pool };