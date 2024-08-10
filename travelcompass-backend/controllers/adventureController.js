const Adventure = require('../models/Adventure');

const getAllAdventures = async (req, res) => {
  try {
    const { location, activityType, minDuration, maxDuration, difficulty } = req.query;
    
    const query = {};
    
    if (location) query.location = { $regex: location, $options: 'i' }; // Case-insensitive match
    if (activityType) query.activityType = activityType;
    if (minDuration) query.duration = { $gte: Number(minDuration) };
    if (maxDuration) query.duration = query.duration || {};
    if (maxDuration) query.duration.$lte = Number(maxDuration);
    if (difficulty) query.difficulty = difficulty;
    
    const adventures = await Adventure.find(query).populate('provider');
    res.json(adventures);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAdventureById = async (req, res) => {
  try {
    const adventure = await Adventure.findById(req.params.id).populate('provider');
    if (!adventure) return res.status(404).json({ error: 'Adventure not found' });
    res.json(adventure);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createAdventure = async (req, res) => {
  try {
    const newAdventure = new Adventure({ ...req.body, provider: req.user.id });
    const savedAdventure = await newAdventure.save();
    res.status(201).json(savedAdventure);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllAdventures, getAdventureById, createAdventure };