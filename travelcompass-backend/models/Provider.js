// models/Provider.js
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
    type:  [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Adventure'
    }]
  }],

  bookingHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
  }],

  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Provider = mongoose.model('Provider', ProviderSchema);
module.exports = Provider;
