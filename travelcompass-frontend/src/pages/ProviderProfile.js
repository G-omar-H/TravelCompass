import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ProviderProfile.css';  // Import the CSS file

const ProviderProfile = () => {
  const [providerData, setProviderData] = useState({
    name: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
  });
  const [logo, setLogo] = useState(null);
  const [logoUrl, setLogoUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
        onUploadProgress: (progressEvent) => {
          if (progressEvent.lengthComputable) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setUploadProgress(100);
      return data.secure_url;
    } catch (error) {
      setError('Error uploading logo.');
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
        return;
      }
    }

    const providerDataWithLogo = { ...providerData, logo: logoUrl };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/providers`, providerDataWithLogo, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      setSuccess('Provider data submitted successfully!');
      setTimeout(() => navigate(`/provider-dashboard/${response.data._id}`), 2000);
    } catch (error) {
      setError('Error submitting provider data.');
      console.error('Error submitting provider data:', error);
    }
  };

  return (
    <div className="container">
      <h1>Provider Profile</h1>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form onSubmit={submitProviderData} className="provider-form">
        <div className="form-group">
          <label>Name:</label>
          <input 
            type="text" 
            name="name" 
            value={providerData.name} 
            onChange={handleInputChange} 
            className="form-input"
            placeholder="Enter provider name"
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea 
            name="description" 
            value={providerData.description} 
            onChange={handleInputChange} 
            className="form-textarea"
            placeholder="Enter provider description"
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label>Contact Email:</label>
          <input 
            type="email" 
            name="contactEmail" 
            value={providerData.contactEmail} 
            onChange={handleInputChange} 
            className="form-input"
            placeholder="Enter contact email"
            required
          />
        </div>
        <div className="form-group">
          <label>Contact Phone:</label>
          <input 
            type="text" 
            name="contactPhone" 
            value={providerData.contactPhone} 
            onChange={handleInputChange} 
            className="form-input"
            placeholder="Enter contact phone number"
          />
        </div>
        <div className="form-group">
          <label>Logo:</label>
          <input 
            type="file" 
            onChange={handleLogoUpload} 
            className="file-input"
          />
          {uploadProgress > 0 && <div className="upload-progress">Upload Progress: {uploadProgress}%</div>}
        </div>
        <button type="submit" className="submit-button">Save</button>
      </form>
    </div>
  );
};

export default ProviderProfile;
