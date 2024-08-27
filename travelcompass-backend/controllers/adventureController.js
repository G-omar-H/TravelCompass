// constrollers/adventureController.js
const Adventure = require('../models/Adventure');
const Provider = require('../models/Provider');
const User = require('../models/User');

const getAllAdventures = async (req, res) => {
  try {
    const { location, activityType, minDuration, maxDuration, difficulty, coordinates, maxDistance } = req.query;

    const query = {};

    if (location) query.location = { $regex: location, $options: 'i' };
    if (coordinates && maxDistance) {
      query.location = {
        $near: {
          $geometry: { type: 'Point', coordinates: coordinates.split(',').map(Number) },
          $maxDistance: maxDistance * 1000 // Convert km to meters
        }
      };
    }
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

    const { title, description, activityType, photos, itinerary, price, location, difficulty, duration, maxGroupSize, availability } = req.body;

    const newAdventure = new Adventure({
      title,
      description,
      activityType,
      photos,
      itinerary,
      price,
      location,
      difficulty,
      duration,
      maxGroupSize,
      availability,
      provider: user.provider
    });

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

    provider.adventures = provider.adventures.filter((id) => id.toString() !== req.params.id);
    await provider.save();

    res.json({ message: 'Adventure deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const updateAdventure = async (req, res) => {
  try {
    const { title, description, activityType, photos, itinerary, price, location, difficulty, duration, maxGroupSize, availability } = req.body;

    const adventure = await Adventure.findById(req.params.id);
    if (!adventure) return res.status(404).json({ error: 'Adventure not found' });

    adventure.title = title || adventure.title;
    adventure.description = description || adventure.description;
    adventure.activityType = activityType || adventure.activityType;
    adventure.photos = photos || adventure.photos;
    adventure.itinerary = itinerary || adventure.itinerary;
    adventure.price = price || adventure.price;
    adventure.location = location || adventure.location;
    adventure.difficulty = difficulty || adventure.difficulty;
    adventure.duration = duration || adventure.duration;
    adventure.maxGroupSize = maxGroupSize || adventure.maxGroupSize;
    adventure.availability = availability || adventure.availability;
    adventure.updatedAt = Date.now();

    const updatedAdventure = await adventure.save();
    res.status(200).json(updatedAdventure);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = { getAllAdventures, getAdventureById, createAdventure, updateAdventure, deleteAdventure };
