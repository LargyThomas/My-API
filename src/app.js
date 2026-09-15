const express = require('express');
const authMiddleware = require('./middlewares/auth.middleware');
const app = express();

// Encode the request body as JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    const mutatingMethods = ['POST', 'PUT', 'DELETE'];
    const publicRoutes = ['/auth/login', '/auth/register'];
    const currentPath = req.path;

    if (mutatingMethods.includes(req.method) && !publicRoutes.includes(currentPath)) {
        return authMiddleware(req, res, next);
    }

    return next();
});

app.use('/animals', require('./features/animals/animals.routes'));
app.use('/auth', require('./features/auth/auth.routes'));

module.exports = app;