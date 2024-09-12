// routes/userRoutes.js
const express = require('express');
const { register, login, refreshToken } = require('../controllers/authController');
const { getUserProfile, updateUserProfile, saveAdventure, unsaveAdventure, favoriteAdventures, getBookingHistory, closeAccount} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/profile/favorites', protect, saveAdventure);
router.delete('/profile/favorites/:id', protect, unsaveAdventure);
router.get('/profile/favorites', protect, favoriteAdventures);
router.get('/profile/bookings', protect, getBookingHistory);
router.delete('/profile/close-account', protect, closeAccount);

module.exports = router;
