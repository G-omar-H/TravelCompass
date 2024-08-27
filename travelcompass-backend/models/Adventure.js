// models/Adventure.js
const mongoose = require('mongoose');

const AdventureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  activityType: { 
    type: String, 
    required: true,
    enum: ['Hiking', 'Trekking', 'Safari', 'Cultural Tour', 'Cycling', 'Kayaking', 'Skydiving', 'Skiing', 'Snowboarding', 'Surfing', 'Scuba Diving', 'Snorkeling', 'Rock Climbing', 'Mountaineering', 'Rafting', 'Bungee Jumping', 'Paragliding', 'Camping', 'Fishing', 'Horseback Riding', 'Wildlife Safari', 'Photography', 'Yoga', 'Meditation', 'Spa & Wellness', 'Cooking', 'Wine Tasting', 'Beer Tasting', 'Music Festival', 'Carnival', 'Marathon', 'Triathlon', 'Cultural Festival', 'Historical Tour', 'Educational Tour', 'Volunteering', 'Sightseeing', 'Shopping', 'Nightlife', 'Food Tour', 'Wine Tour', 'Beer Tour', 'Spiritual Tour', 'Religious Tour', 'Adventure Sports', 'Extreme Sports', 'Water Sports', 'Winter Sports', 'Summer Sports', 'Spring Sports', 'Fall Sports', 'Autumn Sports', 'Multi-Sport', 'Other']
  },
  photos: [String], // Consider adding a 'featuredImage' field for prominent display
  itinerary: [{ // Array to store daily itinerary details
    day: Number,
    description: String,
    activities: [String],
    meals: [String],
    accommodation: String
  }],
  price: { 
    type: Number, 
    required: true 
  },
  location: {
    type: {
      type: String,
      enum: ['Point'], // For geospatial queries
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  difficulty: { type: String, enum: ['Easy', 'Moderate', 'Challenging'], required: true },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  duration: { type: Number, required: true }, // Duration in days
  maxGroupSize: { type: Number }, // Maximum number of participants
  availability: [{ // Dates when the adventure is available
    startDate: Date,
    endDate: Date,
    slotsAvailable: Number // Number of spots left for each date range
  }],
  bookingHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
  createdAt: { type: Date, default: Date.now }, // Track when the adventure was created
  updatedAt: { type: Date, default: Date.now } // Track when the adventure was last updated
});

// Geospatial index for location-based queries
AdventureSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Adventure', AdventureSchema);