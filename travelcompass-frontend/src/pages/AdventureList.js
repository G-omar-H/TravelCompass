import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdventureList = () => {
  const [adventures, setAdventures] = useState([]);

  useEffect(() => {
    const fetchAdventures = async () => {
      const response = await axios.get('/api/adventures');
      setAdventures(response.data);
    };
    fetchAdventures();
  }, []);

  return (
    <div>
      <h1>Adventures</h1>
      <ul>
        {adventures.map(adventure => (
          <li key={adventure._id}>
            <h2>{adventure.title}</h2>
            <p>{adventure.description}</p>
            <p>{adventure.location} - ${adventure.price}</p>
            <p>Created by: {adventure.createdBy.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdventureList;