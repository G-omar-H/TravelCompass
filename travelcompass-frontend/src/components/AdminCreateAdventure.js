import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminCreateAdventure.css';

const AdminCreateAdventure = ({ setIsModalOpen, selectedAdventure }) => {
  const [newAdventure, setNewAdventure] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    difficulty: 'Easy',
    activityTypes: '',
    provider: '', // Provider ID
    photos: [], // Array to hold photo file objects
  });
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [providers, setProviders] = useState([]);
  const [error, setError] = useState('');

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

  useEffect(() => {
    if (selectedAdventure) {
      setNewAdventure({
        title: selectedAdventure.title,
        description: selectedAdventure.description,
        price: selectedAdventure.price,
        duration: selectedAdventure.duration,
        difficulty: selectedAdventure.difficulty,
        activityTypes: selectedAdventure.activityTypes,
        provider: selectedAdventure.provider,
        photos: [], // Reset photos for new uploads
      });
      setPhotoPreviews(selectedAdventure.photos || []);
    }
  }, [selectedAdventure]);

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
      formData.append('upload_preset', 'AdventurePhotos'); // Ensure the correct preset

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

  const saveAdventure = async () => {
    if (!newAdventure.title || !newAdventure.description || !newAdventure.price || !newAdventure.duration || !newAdventure.activityTypes || !newAdventure.provider) {
      setError('Please fill in all required fields.');
      return;
    }

    setError('');
    let photoUrls = [];

    if (newAdventure.photos.length > 0) {
      photoUrls = await uploadPhotosToCloudinary(newAdventure.photos);
      if (photoUrls.length === 0) {
        alert('Failed to upload photos.');
        return;
      }
    }

    try {
      if (selectedAdventure) {
        await axios.put(`${process.env.REACT_APP_API_URL}/admin/adventures/${selectedAdventure._id}`, {
          ...newAdventure,
          photos: photoUrls.length > 0 ? photoUrls : selectedAdventure.photos,
        });
        alert('Adventure updated successfully!');
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/admin/adventures`, {
          ...newAdventure,
          photos: photoUrls,
        });
        alert('Adventure created successfully!');
      }

      setNewAdventure({
        title: '',
        description: '',
        price: '',
        duration: '',
        difficulty: 'Easy',
        activityTypes: '',
        provider: '',
        photos: [],
      });
      setPhotoPreviews([]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving adventure:', error);
      setError('Failed to save adventure. Please try again.');
    }
  };

  return (
      <div className="modal-overlay">
        <div className="modal">
          <h2>{selectedAdventure ? 'Edit Adventure' : 'Create New Adventure'}</h2>
          {error && <p className="error-message">{error}</p>}
          <input
              type="text"
              name="title"
              placeholder="Title"
              value={newAdventure.title}
              onChange={handleInputChange}
              className="modal-input"
          />
          <textarea
              name="description"
              placeholder="Description"
              value={newAdventure.description}
              onChange={handleInputChange}
              className="modal-input"
          />
          <input
              type="number"
              name="price"
              placeholder="Price"
              value={newAdventure.price}
              onChange={handleInputChange}
              className="modal-input"
          />
          <input
              type="number"
              name="duration"
              placeholder="Duration (in days)"
              value={newAdventure.duration}
              onChange={handleInputChange}
              className="modal-input"
          />
          <input
              type="text"
              name="activityTypes"
              placeholder="Activity Type"
              value={newAdventure.activityTypes}
              onChange={handleInputChange}
              className="modal-input"
          />
          <select
              name="difficulty"
              value={newAdventure.difficulty}
              onChange={handleInputChange}
              className="modal-select"
          >
            <option value="Easy">Easy</option>
            <option value="Moderate">Moderate</option>
            <option value="Challenging">Challenging</option>
          </select>
          <select
              name="provider"
              value={newAdventure.provider}
              onChange={handleInputChange}
              className="modal-select"
          >
            <option value="">Select Provider</option>
            {providers.map(provider => (
                <option key={provider._id} value={provider._id}>
                  {provider.name}
                </option>
            ))}
          </select>
          <input
              type="file"
              multiple
              onChange={handlePhotoUpload}
              className="modal-file-input"
          />
          {photoPreviews.length > 0 && (
              <div className="photo-previews">
                {photoPreviews.map((preview, index) => (
                    <img key={index} src={preview} alt={`Preview ${index + 1}`} className="photo-preview" />
                ))}
              </div>
          )}
          <button onClick={saveAdventure} className="modal-submit-button">
            {selectedAdventure ? 'Update Adventure' : 'Create Adventure'}
          </button>
          <button onClick={() => setIsModalOpen(false)} className="modal-cancel-button">Cancel</button>
        </div>
      </div>
  );
};

export default AdminCreateAdventure;