// constrollers/profileController.js
const User = require('../models/User');
const Booking = require('../models/Booking');
const Adventure = require('../models/Adventure');

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('adventure provider');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addFavoriteAdventure = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const adventure = await Adventure.findById(req.body.adventureId);

    if (!adventure) {
      return res.status(404).json({ message: 'Adventure not found' });
    }

    if (user.favorites.includes(adventure._id)) {
      return res.status(400).json({ message: 'Adventure already in favorites' });
    }

    user.favorites.push(adventure._id);
    await user.save();

    res.status(200).json({ message: 'Adventure added to favorites' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFavoriteAdventures = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    res.status(200).json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserBookings,
  addFavoriteAdventure,
  getFavoriteAdventures,
};
