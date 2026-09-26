const { loginService } = require('./auth.service');

// Authenticates a user using an email address and password and returns a token
const login = async (req, res) => {
	try {
		const result = await loginService(req.body);
		res.status(202).json({ message: 'Successful login.', token: result.token, user: result.user });
	} catch (error) {
		if (error.message === 'USER_NOT_FOUND' || error.message === 'INVALID_PASSWORD') {
			return res.status(401).json({ error: 'Invalid email or password.' });
		}
		console.error(error);
		res.status(500).json({ error: 'Error server. Please try again later.' });
	}
};

module.exports = { login };