import React from 'react';
import axios from 'axios';

const FavoriteButton = ({ adventureId }) => {
  const handleAddToFavorites = async () => {
    try {
      await axios.post('/api/profile/favorites', { adventureId });
      alert('Adventure added to favorites!');
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  return (
    <button onClick={handleAddToFavorites}>Add to Favorites</button>
  );
};

export default FavoriteButton;
