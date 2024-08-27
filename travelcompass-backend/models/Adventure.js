// models/Adventure.js
const mongoose = require('mongoose');

const AdventureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  activityTypes: { 
    type: [String], 
    required: true,
    enum: ['Hiking', 'Trekking', 'Safari', 'Cultural Tour', 'Cycling', 'Kayaking', 'Skydiving', 'Skiing', 'Snowboarding', 'Surfing', 'Scuba Diving', 'Snorkeling', 'Rock Climbing', 'Mountaineering', 'Rafting', 'Bungee Jumping', 'Paragliding', 'Camping', 'Fishing', 'Horseback Riding', 'Wildlife Safari', 'Photography', 'Yoga', 'Meditation', 'Spa & Wellness', 'Cooking', 'Wine Tasting', 'Beer Tasting', 'Music Festival', 'Carnival', 'Marathon', 'Triathlon', 'Cultural Festival', 'Historical Tour', 'Educational Tour', 'Volunteering', 'Sightseeing', 'Shopping', 'Nightlife', 'Food Tour', 'Wine Tour', 'Beer Tour', 'Spiritual Tour', 'Religious Tour', 'Adventure Sports', 'Extreme Sports', 'Water Sports', 'Winter Sports', 'Summer Sports', 'Spring Sports', 'Fall Sports', 'Autumn Sports', 'Multi-Sport', 'Other']
  },
  photos: [String],
  itinerary: String,
  price: { type: Number, required: true },
  availability: [{ startDate: Date, endDate: Date }],
  location: String,
  difficulty: { type: String, enum: ['Easy', 'Moderate', 'Challenging'], required: true },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  duration: { type: Number, required: true }, // Duration in days
  bookingHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true }
});

module.exports = mongoose.model('Adventure', AdventureSchema);
