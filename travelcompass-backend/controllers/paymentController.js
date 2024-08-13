// constrollers/paymentController.js
const Stripe = require('stripe');
const Booking = require('../models/Booking');
require('dotenv').config();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: booking.totalAmount * 100, // Stripe amount is in cents
      currency: 'usd',
      payment_method_types: ['card'],
    });

    booking.paymentStatus = 'paid';
    await booking.save();

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPaymentIntent };
