const express = require('express');
const { register, login, getUser } = require('../controllers/authController');
const { getUserProfile, updateUserProfile, saveAdventure , getBookingHistory } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);
router.post('/profile/save-adventure', authMiddleware, saveAdventure);
router.get('/profile/bookings', authMiddleware, getBookingHistory);

module.exports = router;
