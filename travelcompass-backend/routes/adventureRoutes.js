const express = require('express');
const { getAllAdventures, getAdventureById, createAdventure } = require('../controllers/adventureController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllAdventures);
router.get('/:id', getAdventureById);
router.post('/', authMiddleware, createAdventure);

module.exports = router;
