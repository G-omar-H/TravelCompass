// TRAVELCOMPASS-FRONTEND/src/pages/AdventureList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchFilter from '../components/SearchFilter';
import FavoriteButton from '../components/FavoriteButton';
import '../styles/AdventureList.css';

const AdventureList = () => {
  const [adventures, setAdventures] = useState([]);

  useEffect(() => {
    const fetchAdventures = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/adventures`);
        setAdventures(response.data);
      } catch (error) {
        console.error('Error fetching adventures:', error);
      }
    };
    fetchAdventures();
  }, []);

  return (
    <div>
      <h1>Adventure Listings</h1>
      <SearchFilter setAdventures={setAdventures} />
      <div className="adventure-grid">
        {adventures.map((adventure) => (
          <div key={adventure._id} className="adventure-card">
            <img src={adventure.photos[0]} alt={adventure.title} />
            <h2>{adventure.title}</h2>
            <FavoriteButton adventureId={adventure._id} />
            <p>{adventure.description.substring(0, 100)}...</p>
            <p>Price: ${adventure.price}</p>
            <a href={`/adventure/${adventure._id}`}>View Details</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdventureList;
