import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm';

const stripePromise = loadStripe('your-publishable-key-here');

const BookingPage = () => {
  const { id } = useParams();
  const history = useHistory();
  const [adventure, setAdventure] = useState({});
  const [bookingDate, setBookingDate] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    const fetchAdventure = async () => {
      const { data } = await axios.get(`/api/adventures/${id}`);
      setAdventure(data);
    };

    fetchAdventure();
  }, [id]);

  const handleBooking = async () => {
    try {
      const { data } = await axios.post('/api/bookings', {
        adventureId: adventure._id,
        date: bookingDate,
        totalAmount: adventure.price,
      });

      const paymentIntent = await axios.post('/api/bookings/payment-intent', {
        bookingId: data._id,
      });

      setClientSecret(paymentIntent.data.clientSecret);
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  return (
    <div>
      <h1>Book {adventure.title}</h1>
      <p>{adventure.description}</p>
      <label>Choose a date:</label>
      <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} />

      {clientSecret ? (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      ) : (
        <button onClick={handleBooking}>Book Now</button>
      )}
    </div>
  );
};

export default BookingPage;
