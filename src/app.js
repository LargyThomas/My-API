const express = require('express');
const app = express();

app.get('/health', (req, res) => {
    res.status(200).send('ok\n');
});

app.use('/animals', require('./features/animals/animals.routes'));
// app.use('/auth', require('./features/auth/auth.routes'));

module.exports = app;