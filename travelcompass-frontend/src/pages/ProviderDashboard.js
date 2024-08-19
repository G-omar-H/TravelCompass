// TRAVELCOMPASS-FRONTEND/src/pages/ProviderProfile.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ProviderDashboard = () => {
  const { id } = useParams();
  const [provider, setProvider] = useState({});
  const [adventures, setAdventures] = useState([]);

  useEffect(() => {
    const fetchProviderDetails = async () => {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/providers/${id}`);
      setProvider(data);
    };

    const fetchProviderAdventures = async () => {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/providers/${id}/adventures`);
      setAdventures(data);
    };

    fetchProviderDetails();
    fetchProviderAdventures();
  }, [id]);

  return (
    <div>
      <h1>{provider.name}</h1>
      <p>{provider.description}</p>
      <img src={provider.logo} alt={provider.name} />
      <p>Contact: {provider.contactEmail} | {provider.contactPhone}</p>
      
      <h2>Adventures Offered</h2>
      <ul>
        {adventures.map((adventure) => (
          <li key={adventure._id}>
            <Link to={`/adventures/${adventure._id}`}>{adventure.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProviderDashboard;
