// TRAVELCOMPASS-FRONTEND/src/pages/ProviderProfile.js
import React, { useState } from 'react';
import axios from 'axios';

const ProviderProfile= () => {
  const [providerData, setProviderData] = useState({ name: '', description: '', contactEmail: '', contactPhone: '' });
  const [logo, setLogo] = useState(null);

  const handleInputChange = (e) => {
    setProviderData({ ...providerData, [e.target.name]: e.target.value });
  };

  const handleLogoUpload = (e) => {
    setLogo(e.target.files[0]);
  };

  const submitProviderData = async (e) => {
    e.preventDefault();
   
  
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/providers`, providerData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
    } catch (error) {
      console.error('Error submitting provider data:', error);
    }
  };

  return (
    <div>
      <h1>Provider Profile</h1>
      <form onSubmit={submitProviderData}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={providerData.name} onChange={handleInputChange} />
        </div>
        <div>
          <label>Description:</label>
          <textarea name="description" value={providerData.description} onChange={handleInputChange}></textarea>
        </div>
        <div>
          <label>Contact Email:</label>
          <input type="email" name="contactEmail" value={providerData.contactEmail} onChange={handleInputChange} />
        </div>
        <div>
          <label>Contact Phone:</label>
          <input type="text" name="contactPhone" value={providerData.contactPhone} onChange={handleInputChange} />
        </div>
        <div>
          <label>Logo:</label>
          <input type="file" onChange={handleLogoUpload} />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default ProviderProfile;
