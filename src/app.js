const express = require('express');
const app = express();

// Encode the request body as JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
    res.status(200).send('ok\n');
});

app.use('/animals', require('./features/animals/animals.routes'));
app.use('/auth', require('./features/auth/auth.routes'));

module.exports = app;