const express = require('express');
const cors = require('cors');
const authMiddleware = require('./middlewares/auth.middleware');
const app = express();

// Encode the request body as JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for requests from the frontend (Vite dev server)
app.use(cors({ origin: 'http://localhost:5173' }));
app.options('{*split}', cors());

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