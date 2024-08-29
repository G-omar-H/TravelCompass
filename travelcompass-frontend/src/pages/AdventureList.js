import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchFilter from '../components/SearchFilter';
import FavoriteButton from '../components/FavoriteButton';
import '../styles/AdventureList.css';

const AdventureList = () => {
  const [loading, setLoading] = useState(true);
  const [adventures, setAdventures] = useState([]);

  useEffect(() => {
    const fetchAdventures = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/adventures`);
        setAdventures(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching adventures:', error);
        setLoading(false);
      }
    };
    fetchAdventures();
  }, []);

  return (
    <div className="adventure-list-background">
    <div className="adventure-list-container">
      <SearchFilter setAdventures={setAdventures} />
      <h3 class="adventure-list-title">Featured Adventures</h3>
      <div className="adventure-grid">
        {loading ? (
          // Loading skeletons for a better user experience
          [...Array(6)].map((_, index) => (
            <div key={index} className="adventure-card loading-skeleton">
              <div className="skeleton-img"></div>
              <div className="skeleton-text title"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-button"></div>
            </div>
          ))
        ) : (
          adventures.map((adventure) => (
            <div key={adventure._id} className="adventure-card">
              <img src={adventure.photos[0]} alt={adventure.title} />
              <FavoriteButton adventureId={adventure._id} />
              <h2>{adventure.title}</h2>
              <p>{adventure.description.substring(0, 100)}...</p>
              <p>Price: ${adventure.price}</p>
              <a href={`/adventure/${adventure._id}`}>View Details</a>
            </div>
          ))
        )}
      </div>
    </div>
    </div>
  );
};

export default AdventureList;
