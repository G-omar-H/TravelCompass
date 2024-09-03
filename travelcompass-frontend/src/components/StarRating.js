// components/StarRating.js
import React from 'react';
import '../styles/StarRating.css';

const StarRating = ({ reviews }) => {
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    return total / reviews.length;
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'star filled' : 'star'}>★</span>
      );
    }
    return stars;
  };

  const averageRating = calculateAverageRating(reviews);

  return <div className="star-rating">{renderStars(averageRating)}</div>;
};

export default StarRating;