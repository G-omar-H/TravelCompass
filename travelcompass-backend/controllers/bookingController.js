const Booking = require('../models/Booking');
const Adventure = require('../models/Adventure');
const Provider = require('../models/Provider');

const createBooking = async (req, res) => {
  try {
    const { adventureId, date, totalAmount } = req.body;

    const adventure = await Adventure.findById(adventureId);
    const provider = await Provider.findById(adventure.provider);

    if (!adventure) {
      return res.status(404).json({ message: 'Adventure not found' });
    }

    const booking = new Booking({
      adventure: adventureId,
      user: req.user.id,
      provider: provider._id,
      date,
      totalAmount,
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('adventure user provider');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId }).populate('adventure provider');

    if (!bookings) {
      return res.status(404).json({ message: 'No bookings found for this user' });
    }

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBooking, getBooking, getUserBookings };
