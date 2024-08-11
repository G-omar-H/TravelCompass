const express = require('express');
const { getAllAdventures, getAdventureById, createAdventure } = require('../controllers/adventureController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllAdventures);
router.get('/:id', getAdventureById);
router.post('/', protect, createAdventure);

module.exports = router;
