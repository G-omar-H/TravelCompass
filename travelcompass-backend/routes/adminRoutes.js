// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { protect, admin, superAdmin } = require('../middleware/authMiddleware');
const {
  getAllUsers,
  deleteUser,
  getAllAdventures,
  createAdventure,
  updateAdventure,
  deleteAdventure,
  getAllBookings,
  deleteBooking,
  getAllProviders,
  deleteProvider,
  makeAdmin,
} = require('../controllers/adminController');

// User management routes
router.route('/users').get(protect, admin, getAllUsers);
router.route('/users/:id').delete(protect, admin, deleteUser);

// Adventure management routes
router.route('/adventures')
  .get(protect, admin, getAllAdventures)
  .post(protect, admin, createAdventure);
router.route('/adventures/:id')
  .put(protect, admin, updateAdventure)
  .delete(protect, admin, deleteAdventure);

// Booking management routes
router.route('/bookings').get(protect, admin, getAllBookings);
router.route('/bookings/:id').delete(protect, admin, deleteBooking);

// Provider management routes
router.route('/providers').get(protect, admin, getAllProviders);
router.route('/providers/:id').delete(protect, admin, deleteProvider);

// Route to promote a user to admin
router.route('/users/:id/make-admin').put(protect, superAdmin, makeAdmin);

module.exports = router;
