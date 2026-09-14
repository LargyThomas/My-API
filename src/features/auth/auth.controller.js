// Receive the request / call service / send response
const { registerService, loginService } = require('./auth.service');

const register = async (req, res) => {
    try {
        const user = await registerService(req.body);
        res.status(201).json({ message: 'Account creation successful.', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error server. Please try again later.' });
    }
}

const login = async (req, res) => {
    try {
        const result = await loginService(req.body);
        res.status(202).json({ message: 'Successful login.', token: result.token, user: result.user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error server. Please try again later.' });
    }
}

module.exports = { register, login }