/**
 * @swagger
 * /animals:
 *   get:
 *     summary: Récupérer la liste paginée des animaux
 *     tags: [Animals]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Liste des animaux récupérée
 *       404:
 *         description: Aucun animal trouvé
 *       500:
 *         description: Erreur serveur
 *   post:
 *     summary: Créer un animal
 *     tags: [Animals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               external_id:
 *                 type: string
 *                 example: A123
 *               name:
 *                 type: string
 *                 example: Max
 *               animal_type_id:
 *                 type: integer
 *                 example: 1
 *               outcome_type_id:
 *                 type: integer
 *                 example: 2
 *               sex:
 *                 type: string
 *                 example: Male
 *               breed:
 *                 type: string
 *                 example: Labrador
 *     responses:
 *       201:
 *         description: Animal créé
 *       401:
 *         description: Token invalide ou manquant
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /animals/meta/types:
 *   get:
 *     summary: Liste les types d'animaux et les types d'événements disponibles
 *     tags: [Animals]
 *     responses:
 *       200:
 *         description: Listes récupérées
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /animals/{id}:
 *   get:
 *     summary: Récupérer un animal par son identifiant ou son external_id
 *     tags: [Animals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id numérique interne ou external_id (ex. A134067)
 *     responses:
 *       200:
 *         description: Détails de l'animal
 *       404:
 *         description: Animal introuvable
 *       500:
 *         description: Erreur serveur
 *   put:
 *     summary: Mettre à jour un animal
 *     tags: [Animals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Max
 *               age_outcome_days:
 *                 type: integer
 *                 example: 18
 *     responses:
 *       200:
 *         description: Animal mis à jour
 *       401:
 *         description: Token invalide ou manquant
 *       500:
 *         description: Erreur serveur
 *   delete:
 *     summary: Supprimer un animal
 *     tags: [Animals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Animal supprimé
 *       401:
 *         description: Token invalide ou manquant
 *       500:
 *         description: Erreur serveur
 */

const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const { allAnimals, getAnimalById, createAnimal, updateAnimal, deleteAnimal, getAnimalTypes } = require('./animals.controller');

router.get('/', allAnimals);
router.get('/meta/types', getAnimalTypes);
router.get('/:id', getAnimalById);

router.post('/', authMiddleware, createAnimal);
router.put('/:id', authMiddleware, updateAnimal);
router.delete('/:id', authMiddleware, deleteAnimal);

module.exports = router;