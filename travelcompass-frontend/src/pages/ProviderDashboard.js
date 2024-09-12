import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/ProviderDashboard.css';

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
    activityTypes: '',
    photos: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [photoPreviews, setPhotoPreviews] = useState([]);

  useEffect(() => {
    // Clean up preview URLs
    photoPreviews.forEach(preview => URL.revokeObjectURL(preview));

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

  const postProviderAdventure = async () => {
    let photoUrls = [];

    if (newAdventure.photos.length > 0) {
      photoUrls = await uploadPhotosToCloudinary(newAdventure.photos);
      if (photoUrls.length === 0) {
        alert('Failed to upload photos.');
        return;
      }
    }

    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/adventures`, {
        ...newAdventure,
        provider: id,
        photos: photoUrls,
      });
      setAdventures([...adventures, data]);
      setIsModalOpen(false);
      setNewAdventure({
        title: '',
        description: '',
        price: '',
        duration: '',
        difficulty: 'Easy',
        activityTypes: '',
        photos: [],
      });
      setPhotoPreviews([]);
    } catch (error) {
      console.error('Error posting new adventure:', error);
    }
  };

  const deleteAdventure = async (adventureId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/adventures/${adventureId}`);
      setAdventures(adventures.filter(adventure => adventure._id !== adventureId));
    } catch (error) {
      console.error('Error deleting adventure:', error);
    }
  };

  return (
      <div className="container">
        <img src={provider.logo} alt={provider.name} className="provider-logo" />
        <h1 className="provider-name">{provider.name}</h1>
        <p className="provider-description">{provider.description}</p>
        <p className="provider-contact">Contact: {provider.contactEmail} | {provider.contactPhone}</p>

        <h2>Adventures Offered</h2>
        <ul className="adventure-list">
          {adventures.map((adventure) => (
              <li key={adventure._id} className="adventure-item">
                <Link to={`/adventures/edit/${adventure._id}`} className="adventure-link">{adventure.title}</Link>
                <button onClick={() => deleteAdventure(adventure._id)} className="delete-button">Delete</button>
              </li>
          ))}
        </ul>

        <button onClick={() => setIsModalOpen(true)} className="post-adventure-button">Post New Adventure</button>

        {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal">
                <h2>Post a New Adventure</h2>
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
                    className="modal-textarea"
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

                <div className="modal-actions">
                  <button onClick={postProviderAdventure} className="modal-submit-button">Submit</button>
                  <button onClick={() => setIsModalOpen(false)} className="modal-cancel-button">Cancel</button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default ProviderDashboard;