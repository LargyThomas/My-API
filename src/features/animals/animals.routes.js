// Endpoints HTTP / Router -> controller
const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const { allAnimals, getAnimalById, createAnimal, updateAnimal, deleteAnimal } = require('./animals.controller');

router.get('/', allAnimals);
router.get('/:id', getAnimalById);

router.post('/', authMiddleware, createAnimal);
router.put('/:id', authMiddleware, updateAnimal);
router.delete('/:id', authMiddleware, deleteAnimal);

module.exports = router;