const express = require('express');
const cors = require('cors');
const passport = require('./config/passport');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Required when using a proxy such as Render's
app.set('trust proxy', 1);

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({ origin: FRONTEND_URL, credentials: true }));

// Without a session: Passport is used solely to communicate with Google
app.use(passport.initialize());

app.use('/animals', require('./features/animals/animals.routes'));
app.use('/api/auth', require('./features/auth/auth.routes'));

module.exports = app;