// TRAVELCOMPASS-FRONTEND/src/components/AdminCreateAdventure.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminCreateAdventure = (setIsModalOpen) => {
  const [newAdventure, setNewAdventure] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    difficulty: 'Easy',
    activityType: '',
    provider: '', // Provider ID
    photos: [], // Array to hold photo file objects
  });
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/admin/providers`);
        setProviders(data);
      } catch (error) {
        console.error('Error fetching providers:', error);
      }
    };

    fetchProviders();
  }, []);

  const handleInputChange = (e) => {
    setNewAdventure({ ...newAdventure, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewAdventure((prevAdventure) => ({
      ...prevAdventure,
      photos: [...prevAdventure.photos, ...files],
    }));

    const previews = files.map(file => URL.createObjectURL(file));
    setPhotoPreviews((prevPreviews) => [...prevPreviews, ...previews]);
  };

  const uploadPhotosToCloudinary = async (files) => {
    const uploadedUrls = [];
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'AdventurePhotos'); // Make sure you have the correct preset

      try {
        const response = await fetch('https://api.cloudinary.com/v1_1/dus06vafo/image/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        uploadedUrls.push(data.secure_url);
      } catch (error) {
        console.error('Error uploading photo:', error);
      }
    });

    await Promise.all(uploadPromises);
    return uploadedUrls;
  };

  const postAdventure = async () => {
    let photoUrls = [];

    if (newAdventure.photos.length > 0) {
      photoUrls = await uploadPhotosToCloudinary(newAdventure.photos);
      if (photoUrls.length === 0) {
        alert('Failed to upload photos.');
        return;
      }
    }

    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/admin/adventures`, {
        ...newAdventure,
        photos: photoUrls,
      });
      alert('Adventure created successfully!');
      // Clear form fields and previews
      setNewAdventure({
        title: '',
        description: '',
        price: '',
        duration: '',
        difficulty: 'Easy',
        activityType: '',
        provider: '',
        photos: [],
      });
      setPhotoPreviews([]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error posting new adventure:', error);
    }
  };

  return (
    <div>
      <h1>Create New Adventure</h1>
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
      <select
        name="provider"
        value={newAdventure.provider}
        onChange={handleInputChange}
        placeholder="Select Provider"
      >
        <option value="">Select Provider</option>
        {providers.map((provider) => (
          <option key={provider._id} value={provider._id}>
            {provider.name}
          </option>
        ))}
      </select>
      <input
        type="file"
        multiple
        onChange={handlePhotoUpload}
      />
      {photoPreviews.length > 0 && (
        <div className="photo-previews">
          {photoPreviews.map((preview, index) => (
            <img key={index} src={preview} alt={`Preview ${index + 1}`} style={{ width: '100px', height: 'auto', marginRight: '10px' }} />
          ))}
        </div>
      )}
      <button onClick={postAdventure}>Create Adventure</button>
    </div>
  );
};

export default AdminCreateAdventure;
