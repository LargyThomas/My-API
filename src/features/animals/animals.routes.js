// Endpoints HTTP / Router -> controller
const express = require('express');
const router = express.Router();
const { allAnimals } = require('./animals.controller');

router.get('/', allAnimals);

module.exports = router;