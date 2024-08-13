// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createBooking, getBooking, getUserBookings } = require('../controllers/bookingController');
const { createPaymentIntent } = require('../controllers/paymentController');

// Routes for managing bookings
router.route('/').post(protect, createBooking);
router.route('/:id').get(protect, getBooking);
router.route('/user/:userId').get(protect, getUserBookings);

// Payment routes
router.route('/payment-intent').post(protect, createPaymentIntent);

module.exports = router;
