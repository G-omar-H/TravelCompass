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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAdventureDetails = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/adventures/${id}`);
      setAdventure(response.data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching adventure');
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/reviews/${id}`);
      setReviews(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Error fetching reviews');
      setLoading(false);
    }
  };

  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!adventure) {
    return <div>No adventure found</div>;
  }

  return (
        <div className="adventure-details container">
          <header className="header">
            <div className="header-content">
              <h1>{adventure.title}</h1>
              <div className="header-subinfo">
                <span className="location">{adventure.location}</span>
                <span className="rating">{'★'.repeat(calculateAverageRating(reviews))} ({reviews.length} reviews)</span>
              </div>
              <FavoriteButton adventureId={adventure._id}/>
            </div>
          </header>

          <section className="hero">
            {adventure.photos && adventure.photos.length > 0 && (
                <div className="photo-gallery">
                  {adventure.photos.map((photo, index) => (
                      <img key={index} src={photo} alt={`Adventure photo ${index + 1}`} className="gallery-image"/>
                  ))}
                </div>
            )}
          </section>

          <section className="overview">
            <div className="overview-grid">
              <div className="info">
                <h2>About this Adventure</h2>
                <p>{adventure.description}</p>
                <p><strong>Location:</strong> {adventure.location}</p>
                <p><strong>Activity
                  Type:</strong> {adventure.activityTypes ? adventure.activityTypes.join(', ') : 'N/A'}</p>
                <p><strong>Difficulty:</strong> {adventure.difficulty}</p>
                <p><strong>Duration:</strong> {adventure.duration} days</p>
                <p><strong>Max Group Size:</strong> {adventure.maxGroupSize}</p>
                <p>Provider: {adventure.provider ? adventure.provider.name : 'Unknown'}</p>

                <h3>Itinerary</h3>
                {adventure.itinerary && (
                    <ul className="itinerary">
                      {adventure.itinerary.map((day, index) => (
                          <li key={index}>
                            <h4>Day {day.day}</h4>
                            <p>{day.description}</p>
                            <ul className="activities">
                              {day.activities.map((activity, idx) => (
                                  <li key={idx}>{activity}</li>
                              ))}
                            </ul>
                            <p><strong>Meals:</strong> {day.meals.join(', ')}</p>
                            <p><strong>Accommodation:</strong> {day.accommodation}</p>
                          </li>
                      ))}
                    </ul>
                )}

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
              </div>

              <div className="booking">
                <h2>Book Your Adventure</h2>
                <div className="booking-form">
                  <p><strong>Price:</strong> ${adventure.price} per person</p>
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
                    <PaymentForm adventureId={id} quantity={quantity} date={bookingDate}/>
                  </Elements>
                </div>
              </div>
            </div>
          </section>

          <section className="reviews">
            <h2>Reviews</h2>
            {reviews.length === 0 ? (
                <p>No reviews yet. Be the first to leave a review!</p>
            ) : (
                reviews.map((review) => (
                    <div className="review" key={review._id}>
                      <strong>{review.user.name}</strong>
                      <span>{'★'.repeat(review.rating)}</span>
                      <p>{review.comment}</p>
                    </div>
                ))
            )}
          </section>

          <section className="leave-review">
            <h3>Leave a Review</h3>
            <form onSubmit={submitReview}>
              <div className="form-group">
                <label>Rating:</label>
                <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                  {[1, 2, 3, 4, 5].map((value) => (
                      <option key={value} value={value}>
                        {value} Star{value > 1 && 's'}
                      </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Comment:</label>
                <textarea value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
              </div>
              <button type="submit">Submit Review</button>
            </form>
          </section>
        </div>
        );
        };

        export default AdventureDetails;