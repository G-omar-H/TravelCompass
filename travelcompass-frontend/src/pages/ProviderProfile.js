// TRAVELCOMPASS-FRONTEND/src/pages/ProviderProfile.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProviderProfile= () => {
  const [providerData, setProviderData] = useState({ name: '', description: '', contactEmail: '', contactPhone: '' });
  const [logo, setLogo] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setProviderData({ ...providerData, [e.target.name]: e.target.value });
  };

  const handleLogoUpload = (e) => {
    setLogo(e.target.files[0]);
  };

  

  const uploadLogoToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'Providers  Docs'); 

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dus06vafo/image/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading logo:', error);
      return null;
    }
  };

  const submitProviderData = async (e) => {
    e.preventDefault();

    let logoUrl = '';

    if (logo) {
      logoUrl = await uploadLogoToCloudinary(logo);
      if (!logoUrl) {
        alert('Failed to upload logo.');
        return;
      }
    }

    const providerDataWithLogo = { ...providerData, logo: logoUrl };

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/providers`, providerDataWithLogo, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log("Provider data submitted successfully");
      navigate('/provider-dashboard');
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