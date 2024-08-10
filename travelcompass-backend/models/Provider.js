const mongoose = require('mongoose');

const ProviderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  contactEmail: {
    type: String,
    required: true,
    unique: true,
  },
  contactPhone: {
    type: String,
  },
  logo: {
    type: String, // URL to the logo image
  },
  adventures: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Adventure',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Provider = mongoose.model('Provider', ProviderSchema);
module.exports = Provider;
