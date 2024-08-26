// TRAVELCOMPASS-FRONTEND/src/pages/ProviderDashboard.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ProviderDashboard = () => {
  const { id } = useParams();
  const [provider, setProvider] = useState({});
  const [adventures, setAdventures] = useState([]);
  const [newAdventure, setNewAdventure] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    difficulty: 'Easy',
    activityType: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProviderDetails = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/providers/${id}`);
        setProvider(data);
      } catch (error) {
        console.error('Error fetching provider details:', error);
      }
    };

    const fetchProviderAdventures = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/providers/${id}/adventures`);
        setAdventures(data);
      } catch (error) {
        console.error('Error fetching provider adventures:', error);
      }
    };

    fetchProviderDetails();
    fetchProviderAdventures();
  }, [id]);

  const handleInputChange = (e) => {
    setNewAdventure({ ...newAdventure, [e.target.name]: e.target.value });
  };

  const postProviderAdventure = async () => {
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/adventures`, {
        ...newAdventure,
        provider: id,
      });
      setAdventures([...adventures, data]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error posting new adventure:', error);
    }
  };

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
      
      <button onClick={() => setIsModalOpen(true)}>Post New Adventure</button>

      {isModalOpen && (
        <div className="modal">
          <h2>Post a New Adventure</h2>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newAdventure.title}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={newAdventure.description}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={newAdventure.price}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="duration"
            placeholder="Duration (in days)"
            value={newAdventure.duration}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="activityType"
            placeholder="Activity Type"
            value={newAdventure.activityType}
            onChange={handleInputChange}
          />

          <select
            name="difficulty"
            value={newAdventure.difficulty}
            onChange={handleInputChange}
          >
            <option value="Easy">Easy</option>
            <option value="Moderate">Moderate</option>
            <option value="Challenging">Challenging</option>
          </select>
          <button onClick={postProviderAdventure}>Submit</button>
          <button onClick={() => setIsModalOpen(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default ProviderDashboard;
