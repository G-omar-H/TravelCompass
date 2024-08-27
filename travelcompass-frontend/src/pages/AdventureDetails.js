// TRAVELCOMPASS-FRONTEND/src/pages/AdventureDetails.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PaymentForm from '../components/PaymentForm';
import FavoriteButton from '../components/FavoriteButton';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import "../styles/AdventureDetails.css"; // Import the new CSS

const stripeApiKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;

if (!stripeApiKey) {
  console.error('Stripe API key is missing.');
}

const stripePromise = loadStripe(stripeApiKey);

const AdventureDetails = () => {
  const { id } = useParams();
  const [adventure, setAdventure] = useState({});
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [bookingDate, setBookingDate] = useState('');

  const fetchAdventureDetails = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/adventures/${id}`);
      setAdventure(data);
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

  const submitReview = async (e) => {
    e.preventDefault();
    await axios.post(`${process.env.REACT_APP_API_URL}/reviews`, { adventureId: id, rating, comment });
    setRating(0);
    setComment('');
    fetchReviews();
  };

  return (
    <div className="adventure-details">
      <h1>{adventure.title}</h1>
      <FavoriteButton adventureId={adventure._id} />
      <div className="adventure-content">
        {adventure.photos && adventure.photos.length > 0 && (
          <div className="photo-gallery">
            {adventure.photos.map((photo, index) => (
              <img key={index} src={photo} alt={`Adventure photo ${index + 1}`} className="gallery-image" />
            ))}
          </div>
        )}
        <p>{adventure.description}</p>
        <p>Price: ${adventure.price}</p>
        <p>Itinerary: {adventure.itinerary}</p>
        <p>Location: {adventure.location}</p>
        <p>Difficulty: {adventure.difficulty}</p>
        <p>Duration: {adventure.duration} days</p>

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

        <div className="reviews">
          <h2>Reviews</h2>
          {reviews.map((review) => (
            <div className="review" key={review._id}>
              <strong>{review.user.name}</strong>
              <span>{'★'.repeat(review.rating)}</span>
              <p>{review.comment}</p>
            </div>
          ))}
        </div>

        <div className="leave-review">
          <h3>Leave a Review</h3>
          <form onSubmit={submitReview}>
            <div>
              <label>Rating:</label>
              <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>
                    {value} Star{value > 1 && 's'}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Comment:</label>
              <textarea value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
            </div>
            <button type="submit">Submit Review</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdventureDetails;
