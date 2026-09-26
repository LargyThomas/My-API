/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       202:
 *         description: Connexion réussie
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Email ou mot de passe invalide
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Démarre la connexion via Google (redirige vers l'écran de consentement Google)
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirection vers Google
 */

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Callback appelé par Google après connexion, redirige vers le frontend avec un token
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirection vers le frontend avec ?token=...
 */

const express = require('express');
const router = express.Router();
const passport = require('../../config/passport');
const { login } = require('./auth.controller');
const { validateLogin } = require('./auth.validation');
const { generateToken } = require('./auth.service');

// Standard login via email and password
router.post('/login', validateLogin, login);

// Redirects the user to the Google sign-in screen
router.get('/google', passport.authenticate('google', {
	scope: ['profile', 'email'],
	session: false
}));

// Google returns a code here; Passport exchanges it for the profile, 
// and then we generate our own JWT to remain consistent with the standard login process
router.get('/google/callback',
	passport.authenticate('google', { session: false }),
	(req, res) => {
		const token = generateToken(req.user);
		const frontendUrl = process.env.FRONTEND_URL;
		res.redirect(`${frontendUrl}/login?token=${token}`);
	}
);

module.exports = router;