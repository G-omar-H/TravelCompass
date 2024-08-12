// controllers/providerController.js
const Provider = require('../models/Provider');
const Adventure = require('../models/Adventure');

const createProvider = async (req, res) => {
  try {
    const provider = new Provider({
      ...req.body,
      adventures: [],
    });

    await provider.save();

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.roles.push('provider');
    await user.save();

    res.status(201).json(provider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProvider = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id).populate('adventures');

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    res.status(200).json(provider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProvider = async (req, res) => {
  try {
    const provider = await Provider.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    res.status(200).json(provider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProvider = async (req, res) => {
  try {
    const provider = await Provider.findByIdAndDelete(req.params.id);

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    res.status(200).json({ message: 'Provider deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProviderAdventures = async (req, res) => {
  try {
    const adventures = await Adventure.find({ provider: req.params.id });

    if (!adventures) {
      return res.status(404).json({ message: 'No adventures found for this provider' });
    }

    res.status(200).json(adventures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createProvider, getProvider, updateProvider, deleteProvider, getProviderAdventures };
