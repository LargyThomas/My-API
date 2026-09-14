// Endpoints HTTP / Router -> controller
const express = require('express');
const router = express.Router();
const { allAnimals } = require('./animals.controller');
const { getAnimalById } = require('./animals.controller');

router.get('/', allAnimals);
router.get('/:id', getAnimalById);

module.exports = router;