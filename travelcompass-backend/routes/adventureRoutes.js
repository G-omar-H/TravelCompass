// routes/adventureRoutes.js
const express = require('express');
const { getAllAdventures, getAdventureById, createAdventure } = require('../controllers/adventureController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllAdventures);
router.get('/:id', getAdventureById);
router.post('/', protect, authorize('admin', 'provider'), createAdventure);

module.exports = router;
