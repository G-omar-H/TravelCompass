// travelcompass-frontend/src/components/BookingForm.js
import React, { useState } from 'react';
import axios from 'axios';

const BookingForm = ({ adventureId }) => {
  const [numberOfPeople, setNumberOfPeople] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/bookings`, {
        adventureId,
        numberOfPeople,
      });
      alert('Booking successful!');
    } catch (err) {
      console.error(err);
      alert('Booking failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Number of People:
        <input
          type="number"
          value={numberOfPeople}
          onChange={(e) => setNumberOfPeople(e.target.value)}
          min="1"
        />
      </label>
      <button type="submit">Book Adventure</button>
    </form>
  );
};

export default BookingForm;
