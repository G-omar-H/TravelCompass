import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PaymentForm from '../components/PaymentForm';
import axios from 'axios';

const AdventureDetails = () => {
  const { id } = useParams();
  const [adventure, setAdventure] = useState({});

  useEffect(() => {
    const fetchAdventureDetails = async () => {
      const response = await axios.get(`/api/adventures/${id}`);
      setAdventure(response.data);
    };
    fetchAdventureDetails();
  }, [id]);

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

      <PaymentForm adventureId={adventureId} quantity={quantity} />
      </div>
    </div>
  );
};

export default AdventureDetails;