import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import '../styles/FavoriteButton.css'; // Import the CSS file for styling

const FavoriteButton = ({ adventureId, className }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkIfFavorite = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/users/profile/favorites`);
        setIsFavorite(data.some(adventure => adventure._id === adventureId));
      } catch (error) {
        console.error('Error checking favorites:', error);
      }
    };

    checkIfFavorite();
  }, [adventureId]);

  const handleToggleFavorite = async () => {
    setLoading(true);
    try {
      if (isFavorite) {
        await axios.delete(`${process.env.REACT_APP_API_URL}/users/profile/favorites/${adventureId}`);
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/users/profile/favorites`, { adventureId });
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      className={`favorite-button ${className}`}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      disabled={loading}
    >
      <FontAwesomeIcon
        icon={isFavorite ? faHeartSolid : faHeartRegular}
        className={`favorite-icon ${isFavorite ? 'solid' : 'regular'}`}
        style={{ color: isFavorite ? 'red' : 'white' }}
      />
      {loading && <span className="loading-spinner"></span>}
    </button>
  );
};

export default FavoriteButton;
