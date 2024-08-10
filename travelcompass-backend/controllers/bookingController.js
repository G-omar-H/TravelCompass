const Booking = require('../models/Booking');
const Adventure = require('../models/Adventure');

const createBooking = async (req, res) => {
  try {
    const adventure = await Adventure.findById(req.body.adventureId);
    if (!adventure) return res.status(404).json({ error: 'Adventure not found' });

    const totalPrice = adventure.price * req.body.numberOfPeople;
    const booking = new Booking({
      adventure: req.body.adventureId,
      user: req.user.id,
      numberOfPeople: req.body.numberOfPeople,
      totalPrice,
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('adventure');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createBooking, getBookings };
