const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createReview, getReviewsByAdventure } = require('../controllers/reviewController');

router.route('/').post(protect, createReview);
router.route('/:adventureId').get(getReviewsByAdventure);

module.exports = router;
