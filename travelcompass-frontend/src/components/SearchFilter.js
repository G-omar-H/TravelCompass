//TRAVELCOMPASS-FRONTEND/src/components/SearchFilter.js
import React, { useState } from 'react';
import axios from 'axios';

const SearchFilter = ({ setAdventures }) => {
  const [location, setLocation] = useState('');
  const [activityType, setActivityType] = useState('');
  const [minDuration, setMinDuration] = useState('');
  const [maxDuration, setMaxDuration] = useState('');
  const [difficulty, setDifficulty] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    
    const response = await axios.get('/api/adventures', {
      params: { location, activityType, minDuration, maxDuration, difficulty }
    });
    setAdventures(response.data);
  };

  return (
    <form onSubmit={handleSearch}>
      <input 
        type="text" 
        placeholder="Location" 
        value={location} 
        onChange={(e) => setLocation(e.target.value)} 
      />
      <input 
        type="text" 
        placeholder="Activity Type" 
        value={activityType} 
        onChange={(e) => setActivityType(e.target.value)} 
      />
      <input 
        type="number" 
        placeholder="Min Duration (days)" 
        value={minDuration} 
        onChange={(e) => setMinDuration(e.target.value)} 
      />
      <input 
        type="number" 
        placeholder="Max Duration (days)" 
        value={maxDuration} 
        onChange={(e) => setMaxDuration(e.target.value)} 
      />
      <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
        <option value="">Select Difficulty</option>
        <option value="Easy">Easy</option>
        <option value="Moderate">Moderate</option>
        <option value="Challenging">Challenging</option>
      </select>
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchFilter;