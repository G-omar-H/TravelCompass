// models/Adventure.js
const mongoose = require('mongoose');

const AdventureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  activityType: { type: String, required: true },
  photos: [String],
  itinerary: String,
  price: { type: Number, required: true },
  availability: [{ startDate: Date, endDate: Date }],
  location: String,
  difficulty: { type: String, enum: ['Easy', 'Moderate', 'Challenging'], required: true },
  duration: { type: Number, required: true }, // Duration in days
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true }
});

module.exports = mongoose.model('Adventure', AdventureSchema);