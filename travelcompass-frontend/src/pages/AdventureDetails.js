// TRAVELCOMPASS-FRONTEND/src/pages/AdventureDetails.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PaymentForm from '../components/PaymentForm';
import axios from 'axios';


const AdventureDetails = () => {
  const { id } = useParams();
  const [adventure, setAdventure] = useState({});
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
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
    };    fetchAdventureDetails();
    fetchReviews();
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    await axios.post(`${process.env.REACT_APP_API_URL}/reviews`, { adventureId: id, rating, comment });
    setRating(0);
    setComment('');
    // Optionally refresh reviews after submission
    

  };

  return (
    <div>
      <h1>{adventure.title}</h1>
      <div className="adventure-details">
        <img src={adventure.photos && adventure.photos[0]} alt={adventure.title} />
        <p>{adventure.description}</p>
        <p>Price: ${adventure.price}</p>
        <p>Itinerary: {adventure.itinerary}</p>
        <p>Location: {adventure.location}</p>
        <p>Difficulty: {adventure.difficulty}</p>
        <p>Duration: {adventure.duration} days</p>
        {/* You can add more details as needed */}
        <label htmlFor="quantity">Quantity:</label>
      <input
        id="quantity"
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />

      <PaymentForm adventureId={id} quantity={quantity} />
      
      <h2>Reviews</h2>
      {reviews.map((review) => (
        <div key={review._id}>
          <strong>{review.user.name}</strong>
          <span>{'★'.repeat(review.rating)}</span>
          <p>{review.comment}</p>
        </div>
      ))}

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
  );
};

export default AdventureDetails;
