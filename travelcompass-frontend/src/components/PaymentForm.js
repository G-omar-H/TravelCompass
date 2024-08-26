//TRAVELCOMPASS-FRONTEND/src/components/PaymentForm.js
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const PaymentForm = ({ adventureId, quantity, date}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [adventure, setAdventure] = useState({});
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!stripe || !elements) {
      return;
    }

    const { data: adventure } = await axios.get(`${process.env.REACT_APP_API_URL}/adventures/${adventureId}`);
    setAdventure(adventure);
  
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/bookings`, {
        adventureId: adventure._id,
        totalAmount: adventure.price * quantity,
        date,

      });
  
      const clientSecret = data.clientSecret;
  
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });
  
      if (result.error) {
        setErrorMessage(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        setPaymentSucceeded(true);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>Pay</button>
      {errorMessage && <div>{errorMessage}</div>}
      {paymentSucceeded && <div>Payment succeeded!</div>}
    </form>
  );
};

export default PaymentForm;
