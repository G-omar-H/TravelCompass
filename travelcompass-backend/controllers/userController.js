// controllers/userController.js
const User = require('../models/User');
const Adventure = require('../models/Adventure');

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedAdventures').populate('bookingHistory.adventure');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const saveAdventure = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const adventure = await Adventure.findById(req.body.adventureId);

    if (!adventure) {
      return res.status(404).json({ message: 'Adventure not found' });
    }

    if (!user.savedAdventures.includes(adventure.id)) {
      user.savedAdventures.push(adventure.id);
      await user.save();
    }

    res.status(200).json(user.savedAdventures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const unsaveAdventure = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const adventure = await Adventure.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!adventure) {
      return res.status(404).json({ message: 'Adventure not found' });
    }

    // Check if the adventure is in the user's savedAdventures
    const adventureIndex = user.savedAdventures.findIndex(id => id.equals(adventure._id));

    if (adventureIndex !== -1) {
      // Remove the adventure from the savedAdventures array
      user.savedAdventures.splice(adventureIndex, 1);
      await user.save();

    }

    res.status(200).json(user.savedAdventures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const favoriteAdventures = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedAdventures');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.savedAdventures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const getBookingHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('bookingHistory.adventure');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.bookingHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const closeAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.savedAdventures = [];
    user.bookingHistory = [];
    await user.save();
    await User.findByIdAndDelete(req.user.id);
    res.status(200).json({ message: 'account closed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserProfile, updateUserProfile, saveAdventure, unsaveAdventure,  favoriteAdventures, getBookingHistory, closeAccount };
