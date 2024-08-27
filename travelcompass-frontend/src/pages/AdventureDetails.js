// TRAVELCOMPASS-FRONTEND/src/pages/AdventureDetails.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PaymentForm from '../components/PaymentForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { getReadableAddress } from '../services/locationUtils';
import axios from 'axios';

const stripeApiKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;
const stripePromise = loadStripe(stripeApiKey);

const AdventureDetails = () => {
  const { id } = useParams();
  const [adventure, setAdventure] = useState({});
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [bookingDate, setBookingDate] = useState('');
  const [locationString, setLocationString] = useState('');

  const fetchAdventureDetails = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/adventures/${id}`);
      setAdventure(data);
      if (data.location?.coordinates) {
        const location = await getReadableAddress(data.location.coordinates);
        setLocationString(location);
      }
    } catch (error) {
      console.error('Error fetching adventure details:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/reviews/${id}`);
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  useEffect(() => {
    fetchAdventureDetails();
    fetchReviews();
  }, [id]);

  return (
    <div>
      <h1>{adventure.title}</h1>
      <div className="adventure-details">
        {adventure.photos && adventure.photos.length > 0 && (
          <div className="photo-gallery">
            {adventure.photos.map((photo, index) => (
              <img key={index} src={photo} alt={`Adventure photo ${index + 1}`} className="gallery-image" />
            ))}
          </div>
        )}
        <p>{adventure.description}</p>
        <p>Activity Type: {adventure.activityType}</p>
        <p>Price: ${adventure.price}</p>
        <p>Location: {locationString}</p>
        <p>Difficulty: {adventure.difficulty}</p>
        <p>Duration: {adventure.duration} days</p>

        {/* Display the itinerary */}
        <h3>Itinerary</h3>
        {adventure.itinerary && (
          <ul>
            {adventure.itinerary.map((day, index) => (
              <li key={index}>
                <strong>Day {day.day}</strong>: {day.description}
                <p>Activities: {day.activities.join(', ')}</p>
                <p>Meals: {day.meals.join(', ')}</p>
                <p>Accommodation: {day.accommodation}</p>
              </li>
            ))}
          </ul>
        )}

        {/* Display availability dates */}
        <h3>Availability</h3>
        {adventure.availability && (
          <ul>
            {adventure.availability.map((slot, index) => (
              <li key={index}>
                <strong>{new Date(slot.startDate).toLocaleDateString()} - {new Date(slot.endDate).toLocaleDateString()}</strong>
                : {slot.slotsAvailable} spots available
              </li>
            ))}
          </ul>
        )}

        <label htmlFor="quantity">Quantity:</label>
        <input
          id="quantity"
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <label htmlFor="bookingDate">Booking Date:</label>
        <input
          id="bookingDate"
          type="date"
          value={bookingDate}
          onChange={(e) => setBookingDate(e.target.value)}
        />

        <Elements stripe={stripePromise}>
          <PaymentForm adventureId={id} quantity={quantity} date={bookingDate} />
        </Elements>

        {/* Display reviews */}
        <h2>Reviews</h2>
        {reviews.map((review) => (
          <div key={review._id}>
            <strong>{review.user.name}</strong>
            <span>{'★'.repeat(review.rating)}</span>
            <p>{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdventureDetails;
