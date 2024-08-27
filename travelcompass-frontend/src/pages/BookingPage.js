// TRAVELCOMPASS-FRONTEND/src/pages/BookingPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm';

const stripePromise = loadStripe('your-publishable-key-here');

const BookingPage = () => {
  const { id } = useParams();
  const [adventure, setAdventure] = useState({});
  const [bookingDate, setBookingDate] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    const fetchAdventure = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/adventures/${id}`);
        setAdventure(data);
      } catch (error) {
        console.error('Error fetching adventure:', error);
      }
    };
  
    fetchAdventure();
  }, [id]);
  
  const handleBooking = async () => {
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/bookings`, {
        adventureId: adventure._id,
        date: bookingDate,
        totalAmount: adventure.price,
      });
  
      const paymentIntent = await axios.post(`${process.env.REACT_APP_API_URL}/bookings/payment-intent`, {
        bookingId: data._id,
      });
      alert('Client Secret:', paymentIntent.data.clientSecret);
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
          <CheckoutForm clientSecret={clientSecret}/>
        </Elements>
      ) : (
        <button onClick={handleBooking}>Book Now</button>
      )}
    </div>
  );
};

export default BookingPage;
