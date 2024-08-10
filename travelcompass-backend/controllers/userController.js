const User = require('../models/User');

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedAdventures');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { name, email, savedAdventures } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, savedAdventures },
      { new: true }
    ).populate('savedAdventures');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getUserProfile, updateUserProfile };