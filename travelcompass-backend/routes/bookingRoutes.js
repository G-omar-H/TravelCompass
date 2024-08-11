const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createBooking, getBooking, getUserBookings } = require('../controllers/bookingController');
const { createPaymentIntent } = require('../controllers/paymentController');

// Routes for managing bookings
router.route('/').post(authMiddleware, createBooking);
router.route('/:id').get(authMiddleware, getBooking);
router.route('/user/:userId').get(authMiddleware, getUserBookings);

// Payment routes
router.route('/payment-intent').post(authMiddleware, createPaymentIntent);

module.exports = router;
