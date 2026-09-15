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
const { register, login } = require('./auth.controller');
const { validateRegister, validateLogin } = require('./auth.validation');

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

module.exports = router;