// controllers/bookingController.js
const Booking = require('../models/Booking');
const Adventure = require('../models/Adventure');
const Provider = require('../models/Provider');
const User = require('../models/User');

const createBooking = async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { adventureId, totalAmount } = req.body;

    const date = new Date();

    const adventure = await Adventure.findById(adventureId);
    
    if (!adventure) {
      return res.status(404).json({ message: 'Adventure not found' });
    }
    const provider = await Provider.findById(adventure.provider);

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }
    
    if (user.provider === provider._id) {
      return res.status(400).json({ message: 'You cannot book your own adventure' });
    }

    const booking = new Booking({
      adventure: adventureId,
      user: req.user.id,
      provider: provider._id,
      date,
      totalAmount,
    });

    await booking.save();
    if (!user.bookingHistory.includes(adventureId)) {
      user.bookingHistory.push(adventureId);
      await user.save();
    };

    if (!provider.bookingHistory.includes(booking._id)) {
      provider.bookingHistory.push(booking._id);
      await provider.save();
    };

    if (!adventure.bookingHistory.includes(booking._id)) {
      adventure.bookingHistory.push(booking._id);
      await adventure.save();
    };

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

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const bookingDate = new Date(booking.date);
    const currentDate = new Date();
    const timeDifference = currentDate - bookingDate;
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    if (hoursDifference > 24) {
      return res.status(400).json({ message: 'Cannot cancel booking after 24 hours from the booking date' });
    }

    const user = await User.findById(booking.user);
    user.bookingHistory = user.bookingHistory.filter((id) => id !== req.params.id);
    await user.save();

    const provider = await Provider.findById(booking.provider);
    provider.bookingHistory = provider.bookingHistory.filter((id) => id !== req.params.id);
    await provider.save();

    const adventure = await Adventure.findById(booking.adventure);
    adventure.bookingHistory = adventure.bookingHistory.filter((id) => id !== req.params.id);
    await adventure.save();

    await Booking.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Booking canceled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBooking, getBooking, getUserBookings, cancelBooking };
