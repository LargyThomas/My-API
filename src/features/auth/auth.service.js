const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../../db/pool');

const JWT_SECRET = process.env.JWT_SECRET;

// Compare a plaintext password to its hash stored in the database
const comparePassword = async (password, hashedPassword) => {
	return bcrypt.compare(password, hashedPassword);
};

// Checks the email address and password and returns a token if they are valid
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
		// Account created via Google: no local password
		throw new Error('USER_NOT_FOUND');
	}

	const isPasswordValid = await comparePassword(password, user.password_hash);

	if (!isPasswordValid) {
		throw new Error('INVALID_PASSWORD');
	}

	const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

	return { token, user: { id: user.id, email: user.email } };
};

// Generates a token for a user who is already signed in (used by Google Sign-In)
const generateToken = (user) => {
	return jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
};

module.exports = { loginService, generateToken };