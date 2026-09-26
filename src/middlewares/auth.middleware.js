const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// Check the JWT token sent in the Authorization header; otherwise, block the request
const authMiddleware = (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ error: 'Unauthorized: missing bearer token.' });
	}

	const token = authHeader.slice('Bearer '.length).trim();

	if (!token) {
		return res.status(401).json({ error: 'Unauthorized: missing bearer token.' });
	}

	try {
		const decodedToken = jwt.verify(token, JWT_SECRET);
		req.user = decodedToken;
		return next();
	} catch (error) {
		return res.status(401).json({ error: 'Unauthorized: invalid token.' });
	}
};

module.exports = authMiddleware;