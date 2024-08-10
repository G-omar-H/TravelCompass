const express = require('express');
const { createBooking, getBookings } = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createBooking);
router.get('/', authMiddleware, getBookings);

module.exports = router;