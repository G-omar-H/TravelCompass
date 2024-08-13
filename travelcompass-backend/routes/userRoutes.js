// routes/userRoutes.js
const express = require('express');
const { register, login, getUser } = require('../controllers/authController');
const { getUserProfile, updateUserProfile, saveAdventure , getBookingHistory, closeAccount} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/profile/save-adventure', protect, saveAdventure);
router.get('/profile/bookings', protect, getBookingHistory);
router.delete('/profile/close-account', protect, closeAccount);

module.exports = router;
