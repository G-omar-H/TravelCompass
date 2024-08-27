import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchFilter from '../components/SearchFilter';
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
            <p>{adventure.description.substring(0, 100)}...</p>
            <p>Activity Type: {adventure.activityType}</p>
            <p>Price: ${adventure.price}</p>
            <p>
              Location: 
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${adventure.location?.coordinates.join(',')}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                View on Map
              </a>
            </p>
            <p>Difficulty: {adventure.difficulty}</p>
            <p>Available Slots: {adventure.availability?.reduce((total, slot) => total + slot.slotsAvailable, 0)}</p>
            <a href={`/adventure/${adventure._id}`}>View Details</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdventureList;
