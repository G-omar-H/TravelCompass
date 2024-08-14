// routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getUserProfile,
  updateUserProfile,
  getUserBookings,
  addFavoriteAdventure,
  getFavoriteAdventures,
} = require('../controllers/profileController');

// Routes for user profile management
router.route('/').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/bookings').get(protect, getUserBookings);
router.route('/favorites').post(protect, addFavoriteAdventure).get(protect, getFavoriteAdventures);

module.exports = router;
