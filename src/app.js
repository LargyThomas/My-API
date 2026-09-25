const express = require('express');
const cors = require('cors');
const passport = require('./config/passport');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trust proxy when deployed behind a proxy (Render uses proxies)
app.set('trust proxy', 1);

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({ origin: FRONTEND_URL, credentials: true }));

// Stateless: no session, no cookie-based auth, just used to talk to Google
app.use(passport.initialize());

app.use('/animals', require('./features/animals/animals.routes'));
app.use('/api/auth', require('./features/auth/auth.routes'));

module.exports = app;