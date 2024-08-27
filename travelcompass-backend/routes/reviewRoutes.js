// routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createReview, removeReview, getReviewsByAdventure } = require('../controllers/reviewController');

router.route('/').post(protect, createReview);
router.route('/:adventureId').get(getReviewsByAdventure);
router.route('/:id').delete(protect, removeReview);

module.exports = router;
