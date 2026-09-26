/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Créer un compte utilisateur
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
 *       201:
 *         description: Compte créé avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /auth/login:
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
 *       500:
 *         description: Erreur serveur
 */

// Endpoints HTTP / Router -> controller
const express = require('express');
const router = express.Router();
const passport = require('../../config/passport');
const { login } = require('./auth.controller');
const { validateLogin } = require('./auth.validation');
const { generateToken } = require('./auth.service');
const authMiddleware = require('../../middlewares/auth.middleware');
const { pool } = require('../../db/pool');

// Local auth endpoints (email + password)
router.post('/login', validateLogin, login);

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
}));

router.get('/google/callback',
    passport.authenticate('google', { session: false }),
    (req, res) => {
        const token = generateToken(req.user);
        const frontendUrl = process.env.FRONTEND_URL;
        res.redirect(`${frontendUrl}/login?token=${token}`);
    }
);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Récupère l'utilisateur actuellement connecté (via son token)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *       401:
 *         description: Token invalide ou manquant
 */
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query('SELECT id, email, display_name FROM users WHERE id = $1', [req.user.userId]);
        if (result.rows.length === 0) return res.status(404).json({ user: null });
        return res.status(200).json({ user: result.rows[0] });
    } catch (error) {
        return res.status(500).json({ error: 'Error server. Please try again later.' });
    }
});

module.exports = router;