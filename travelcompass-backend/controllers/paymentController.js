const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Adventure = require('../models/Adventure');

const createPaymentIntent = async (req, res) => {
  const { adventureId, quantity } = req.body;

  try {
    const adventure = await Adventure.findById(adventureId);

    if (!adventure) {
      return res.status(404).json({ error: 'Adventure not found' });
    }

    const totalAmount = adventure.price * quantity * 100; // amount in cents

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'usd',
      payment_method_types: ['card'],
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createPaymentIntent };
