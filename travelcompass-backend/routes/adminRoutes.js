// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { protect, admin, authorize } = require('../middleware/authMiddleware');
const {
  getAllUsers,
  deleteUser,
  getAllAdventures,
  createAdventure,
  updateAdventure,
  deleteAdventure,
  getAllBookings,
  getAllProviders,
  deleteProvider,
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

// Provider management routes
router.route('/providers').get(protect, admin, getAllProviders);
router.route('/providers/:id').delete(protect, admin, deleteProvider);

module.exports = router;
