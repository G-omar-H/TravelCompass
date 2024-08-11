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
    await Provider.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Provider deleted successfully' });
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
  getAllProviders,
  deleteProvider,
};
