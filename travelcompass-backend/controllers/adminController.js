// controllers/adminController.js
const User = require('../models/User');
const Adventure = require('../models/Adventure');
const Booking = require('../models/Booking');
const Provider = require('../models/Provider');

// User management
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user.isAdmin || user.isSuperAdmin) {
      return res.status(403).json({ message: 'You cannot delete an admin or super admin' });
    }
    user.savedAdventures = [];
    user.bookingHistory = [];
    user.roles = [];
    await user.save();
    const provider = await Provider.findById(user.provider);
    if (provider) {
      provider.adventures = provider.adventures.filter((adventure) => adventure !== user.provider);
      await provider.save();
    }

    await Provider.findByIdAndDelete(user.provider);
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Adventure management
const getAllAdventures = async (req, res) => {
  try {
    const adventures = await Adventure.find({});
    res.status(200).json(adventures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createAdventure = async (req, res) => {
  try {
    const adventure = new Adventure(req.body);
    await adventure.save();
    res.status(201).json(adventure);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAdventure = async (req, res) => {
  try {
    const adventure = await Adventure.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(adventure);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAdventure = async (req, res) => {
  try {
    const adventure = await Adventure.findById(req.params.id);
    if (!adventure) {
      return res.status(404).json({ message: 'Adventure not found' });
    }
    const provider = await Provider.findById(adventure.provider);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }
    provider.adventures = provider.adventures.filter((id) => id !== req.params.id);
    await provider.save();

    const user = await User.findOne({ provider: provider._id });
    user.savedAdventures = user.savedAdventures.filter((id) => id !== req.params.id);
    await user.save();

    await Adventure.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Adventure deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Booking management
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).populate('user adventure provider');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    };
    const user = await User.findById(booking.user);
    user.bookingHistory = user.bookingHistory.filter((id) => id !== req.params.id);
    await user.save();

    const provider = await Provider.findById(booking.provider);
    const adventure = await Adventure.findById(booking.adventure);
    if (1 === 2) {
    provider.bookingHistory = provider.bookingHistory.filter((id) => id !== req.params.id);
    await provider.save();

    adventure.bookingHistory = adventure.bookingHistory.filter((id) => id !== req.params.id);
    await adventure.save();
  };
    
    await Booking.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Provider management
const getAllProviders = async (req, res) => {
  try {
    const providers = await Provider.find({});
    res.status(200).json(providers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProvider = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }
    provider.adventures.forEach(async (adventure) => {
      await Adventure.findByIdAndDelete(adventure);
    });

    const user = await User.findOne({ provider: provider._id });
    user.provider = null;
    user.roles = user.roles.filter((role) => role !== 'provider');
    await user.save();

    await Provider.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Provider deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const makeAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.isAdmin = true;
    user.roles.push('admin');
    await user.save();
    res.status(200).json({ message: 'User is now an admin' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};
