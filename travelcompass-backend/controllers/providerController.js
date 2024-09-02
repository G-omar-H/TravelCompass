// controllers/providerController.js
const Provider = require('../models/Provider');
const Adventure = require('../models/Adventure');
const User = require('../models/User');

const createProvider = async (req, res) => {
  try {
    
    const user = await User.findById(req.user.id);
  
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.provider) {
      return res.status(400).json({ message: 'User is already a provider' });
    }

    if (user.roles.includes('admin') || user.roles.includes('super-admin')) {
      return res.status(400).json({ message: 'Admins cannot be providers' });
    }

    if (!req.body.name || !req.body.description || !req.body.contactEmail) {
      return res.status(400).json({ message: `Missing ${!req.body.name ? 'name' : !req.body.description ? 'description' : !req.body.contactEmail ? 'contact email' : ''}` });
    }

    const provider = new Provider({
      ...req.body,
      adventures: [],
      user: req.user.id
    });

    await provider.save();

    user.provider = provider._id;
    user.roles.push('provider');
    await user.save();

    res.status(201).json(provider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProvider = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id).populate('adventures').populate('user');

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
    const provider = await Provider.findById(req.params.id);

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    provider.adventures.forEach(async (adventure) => {
      await Adventure.findByIdAndDelete(adventure);
    });

    const user = await User.findById(provider.user);
    user.provider = null;
    user.roles = user.roles.filter((role) => role !== 'provider');
    await user.save();

    await Adventure.deleteMany({ provider: req.params.id });
    
    await Provider.findByIdAndDelete(req.params.id);

    

    res.status(200).json({ message: 'Provider deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProviderAdventures = async (req, res) => {
  try {
    const adventures = await Adventure.find({ provider: req.params.id }).populate('provider');

    if (!adventures) {
      return res.status(404).json({ message: 'No adventures found for this provider' });
    }

    res.status(200).json(adventures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createProvider, getProvider, updateProvider, deleteProvider, getProviderAdventures };
