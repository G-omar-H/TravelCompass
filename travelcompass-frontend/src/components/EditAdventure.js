// TRAVELCOMPASS-FRONEND/src/components/EditAdventure.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/EditAdventure.css'; // Import the CSS file

const EditAdventure = () => {
  const { id } = useParams(); // Get the adventure ID from the URL
  const navigate = useNavigate();
  const [adventure, setAdventure] = useState(null);
  const [photoPreviews, setPhotoPreviews] = useState([]);

  useEffect(() => {
    const fetchAdventureDetails = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/adventures/${id}`);
        setAdventure(data);

        // Generate previews for existing photos
        const previews = data.photos.map((photoUrl) => photoUrl); // Assuming the photos are URLs
        setPhotoPreviews(previews);
      } catch (error) {
        console.error('Error fetching adventure details:', error);
      }
    };

    fetchAdventureDetails();
  }, [id]);

  const handleInputChange = (e) => {
    setAdventure({ ...adventure, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setAdventure((prevAdventure) => ({
      ...prevAdventure,
      photos: [...prevAdventure.photos, ...files],
    }));

    const previews = files.map((file) => URL.createObjectURL(file));
    setPhotoPreviews((prevPreviews) => [...prevPreviews, ...previews]);
  };

  const uploadPhotosToCloudinary = async (files) => {
    const uploadedUrls = [];
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'AdventurePhotos');

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

  const updateAdventure = async () => {
    let photoUrls = [];

    if (adventure.photos && adventure.photos.length > 0) {
      photoUrls = await uploadPhotosToCloudinary(adventure.photos);
    }

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/adventures/${id}`, {
        ...adventure,
        photos: photoUrls.length > 0 ? photoUrls : adventure.photos,
      });

      alert('Adventure updated successfully!');
      navigate(`/provider-dashboard/${adventure.provider._id}`); // Navigate back to the provider dashboard after updating
    } catch (error) {
      console.error('Error updating adventure:', error);
    }
  };

  if (!adventure) return <div>Loading...</div>;

  return (
    <div className="edit-adventure-container">
      <h2>Edit Adventure</h2>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={adventure.title}
        onChange={handleInputChange}
        className="edit-input"
      />
      <input
        type="text"
        name="description"
        placeholder="Description"
        value={adventure.description}
        onChange={handleInputChange}
        className="edit-input"
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={adventure.price}
        onChange={handleInputChange}
        className="edit-input"
      />
      <input
        type="number"
        name="duration"
        placeholder="Duration (in days)"
        value={adventure.duration}
        onChange={handleInputChange}
        className="edit-input"
      />
      <input
        type="text"
        name="activityType"
        placeholder="Activity Type"
        value={adventure.activityType}
        onChange={handleInputChange}
        className="edit-input"
      />

      <select
        name="difficulty"
        value={adventure.difficulty}
        onChange={handleInputChange}
        className="edit-select"
      >
        <option value="Easy">Easy</option>
        <option value="Moderate">Moderate</option>
        <option value="Challenging">Challenging</option>
      </select>

      <input
        type="file"
        multiple
        onChange={handlePhotoUpload}
        className="edit-file-input"
      />

      {photoPreviews.length > 0 && (
        <div className="photo-previews">
          {photoPreviews.map((preview, index) => (
            <img key={index} src={preview} alt={`Preview ${index + 1}`} className="photo-preview" />
          ))}
        </div>
      )}

      <button onClick={updateAdventure} className="update-button">Update Adventure</button>
    </div>
  );
};

export default EditAdventure;
