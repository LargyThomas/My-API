// Business logic / Validation / Pagination
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../../db/pool');

const JWT_SECRET = process.env.JWT_SECRET;

const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
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

    if (!user.password_hash) {
        // Account created via Google, no local password set
        throw new Error('USER_NOT_FOUND');
    }

    const isPasswordValid = await comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
        throw new Error('INVALID_PASSWORD');
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    return { token, user: { id: user.id, email: user.email } };
};

const generateToken = (user) => {
    return jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
};

module.exports = { loginService, generateToken };