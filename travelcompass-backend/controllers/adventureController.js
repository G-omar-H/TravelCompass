// constrollers/adventureController.js
const Adventure = require('../models/Adventure');
const Provider = require('../models/Provider');
const User = require('../models/User');

const getAllAdventures = async (req, res) => {
  try {
    const { location, activityTypes, minDuration, maxDuration, difficulty } = req.query;
    
    const query = {};
    
    if (location) query.location = { $regex: location, $options: 'i' }; // Case-insensitive match
    if (activityTypes) query.activityTypes = activityTypes;
    if (minDuration) query.duration = { $gte: Number(minDuration) };
    if (maxDuration) query.duration = query.duration || {};
    if (maxDuration) query.duration.$lte = Number(maxDuration);
    if (difficulty) query.difficulty = difficulty;
    
    const adventures = await Adventure.find(query).populate('provider').populate('reviews').populate('bookingHistory');
    res.json(adventures);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAdventureById = async (req, res) => {
  try {
    const adventure = await Adventure.findById(req.params.id).populate('provider').populate('reviews').populate('bookingHistory');
    if (!adventure) return res.status(404).json({ error: 'Adventure not found' });
    res.json(adventure);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createAdventure = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    if (!user.provider) {
      return res.status(400).json({ error: 'User is not a provider' });
    }

    const provider = await Provider.findById(user.provider);

    if (!provider) {
      return res.status(404).json({ error: 'Provider not found' });
    }
    const newAdventure = await Adventure.create({ ...req.body, provider: user.provider });
    const savedAdventure = await newAdventure.save();

    provider.adventures.push(savedAdventure._id);
    await provider.save();

    res.status(201).json(savedAdventure);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteAdventure = async (req, res) => {
  try {
    const adventure = await Adventure.findById(req.params.id);
    if (!adventure) return res.status(404).json({ error: 'Adventure not found' });

    const provider = await Provider.findById(adventure.provider);
    if (!provider) return res.status(404).json({ error: 'Provider not found' });

    await Adventure.findByIdAndDelete(req.params.id);
    provider.adventures = provider.adventures.filter((id) => id !== req.params.id);
    await provider.save();
    res.json({ message: 'Adventure deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateAdventure = async (req, res) => {
  try {
    const adventure = await Adventure.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!adventure) return res.status(404).json({ error: 'Adventure not found' });
    res.status(200).json(adventure);
  } catch (err) {
    res.status(500).json({ error: err.message });
  };
};

module.exports = { getAllAdventures, getAdventureById, createAdventure, updateAdventure, deleteAdventure };
