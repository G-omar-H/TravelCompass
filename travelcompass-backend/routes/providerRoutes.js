const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { createProvider, getProvider, updateProvider, deleteProvider, getProviderAdventures } = require('../controllers/providerController');

// Routes for managing provider profiles
router.route('/').post(protect, authorize('provider'), createProvider);
router.route('/:id')
  .get(getProvider)
  .put(protect, authorize('provider'), updateProvider)
  .delete(protect, authorize('provider'), deleteProvider);

// Route to get all adventures for a specific provider
router.route('/:id/adventures').get(getProviderAdventures);

module.exports = router;
