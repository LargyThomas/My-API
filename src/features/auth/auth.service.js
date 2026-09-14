// Business logic / Validation / Pagination
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../../db/pool');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

const hashPassword = async (password) => {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};

const registerService = async ({ email, password }) => {
    if (!email || !password) {
        throw new Error('INVALID_INPUT');
    }

    const existing = await pool.query(`
        SELECT 1
        FROM users
        WHERE email = $1
    `, [email]);

    if (existing.rows.length > 0) {
        throw new Error('EMAIL_ALREADY_EXISTS');
    }

    const hashedPassword = await hashPassword(password);

    const result = await pool.query(`
        INSERT INTO users (email, password_hash, created_at)
        VALUES ($1, $2, NOW())
        RETURNING id, email, created_at
    `, [email, hashedPassword]);

    return result.rows[0];
};

const loginService = async ({ email, password }) => {
    if (!email || !password) {
        throw new Error('INVALID_INPUT');
    }

    const result = await pool.query(`
        SELECT id, email, password_hash
        FROM users
        WHERE email = $1
    `, [email]);

    if (result.rows.length === 0) {
        throw new Error('USER_NOT_FOUND');
    }

    const user = result.rows[0];
    const isPasswordValid = await comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
        throw new Error('INVALID_PASSWORD');
    }

    const token = jwt.sign( { userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' } );

    return { token, user: { id: user.id, email: user.email } };
};

module.exports = { registerService, loginService };