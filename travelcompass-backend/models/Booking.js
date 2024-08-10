const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  adventure: { type: mongoose.Schema.Types.ObjectId, ref: 'Adventure', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookingDate: { type: Date, default: Date.now },
  numberOfPeople: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
});

module.exports = mongoose.model('Booking', BookingSchema);
