// controllers/paymentController.js
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

    booking.paymentIntentId = paymentIntent.id;
    booking.paymentStatus = 'unpaid';
    await booking.save();

    res.status(200).json({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Webhook endpoint to handle Stripe events
const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = await stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
  case 'payment_intent.succeeded': {
    const paymentIntentSucceeded = event.data.object;
    await Booking.findOneAndUpdate(
      { paymentIntentId: paymentIntentSucceeded.id },
      { paymentStatus: 'paid', status: 'confirmed' },
      { new: true }
    );
    break;
  }

  case 'payment_intent.payment_failed': {
    const paymentIntentFailed = event.data.object;
    await Booking.findOneAndUpdate(
      { paymentIntentId: paymentIntentFailed.id },
      { paymentStatus: 'failed', status: 'cancelled' },
      { new: true }
    );
    break;
  }
    
  case 'payment_intent.canceled': {
    const paymentIntentCanceled = event.data.object;
    await Booking.findOneAndUpdate(
      { paymentIntentId: paymentIntentCanceled.id },
      { paymentStatus: 'canceled', status: 'cancelled' },
      { new: true }
    );
    break;
  }
    
  case 'payment_intent.processing': {
    const paymentIntentProcessing = event.data.object;
    await Booking.findOneAndUpdate(
      { paymentIntentId: paymentIntentProcessing.id },
      { paymentStatus: 'processing', status: 'confirmed' },
      { new: true }
    );
    break;
  }
    
  case 'payment_intent.requires_action': {
    const paymentIntentRequiresAction = event.data.object;
    await Booking.findOneAndUpdate(
      { paymentIntentId: paymentIntentRequiresAction.id },
      { paymentStatus: 'requires_action', status: 'confirmed' },
      { new: true }
    );
    break;
  }
    
  case 'payment_intent.requires_payment_method': {
    const paymentIntentRequiresPaymentMethod = event.data.object;
    await Booking.findOneAndUpdate(
      { paymentIntentId: paymentIntentRequiresPaymentMethod.id },
      { paymentStatus: 'requires_payment_method', status: 'cancelled' },
      { new: true }
    );
    break;
  }
    
  case 'payment_intent.amount_capturable_updated': {
    const paymentIntentAmountCapturableUpdated = event.data.object;
    await Booking.findOneAndUpdate(
      { paymentIntentId: paymentIntentAmountCapturableUpdated.id },
      { paymentStatus: 'amount_capturable_updated', status: 'confirmed' },
      { new: true }
    );
    break;
  }

  case 'payment_intent.amount_received': {
    const paymentIntentAmountReceived = event.data.object;
    await Booking.findOneAndUpdate(
      { paymentIntentId: paymentIntentAmountReceived.id },
      { paymentStatus: 'amount_received', status: 'confirmed' },
      { new: true }
    );
    break;
  }
    
  case 'payment_intent.amount_refunded': {
    const paymentIntentAmountRefunded = event.data.object;
    await Booking.findOneAndUpdate(
      { paymentIntentId: paymentIntentAmountRefunded.id },
      { paymentStatus: 'amount_refunded', status: 'confirmed' },
      { new: true }
    );
    break;
  }

  default:
    console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
};

module.exports = { createPaymentIntent, handleStripeWebhook };
