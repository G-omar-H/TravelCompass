// TRAVELCOMPASS-FRONTEND/src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/ProfilePage.css';  // Import the CSS file

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/users/profile`);
        setUser(data);
        setName(data.name);
        setEmail(data.email);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    const fetchUserBookings = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/users/profile/bookings`);
        setBookings(data);
      } catch (error) {
        console.error('Error fetching user bookings:', error);
      }
    };

    const fetchFavorites = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/users/profile/favorites`);
        setFavorites(data);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchUserProfile();
    fetchUserBookings();
    fetchFavorites();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/users/profile`, { name, email, password });
      navigate('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="profile-page">
      <h1 className="profile-heading">User Profile</h1>
      <form onSubmit={handleUpdateProfile} className="profile-form">
        <div className="form-group">
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Password (leave blank to keep unchanged):</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="update-button">Update Profile</button>
      </form>

      <h2>Your Bookings</h2>
      <ul className="bookings-list">
        {bookings.map((booking) => (
          <li key={booking._id} className="booking-item">
            {booking.adventure} on {booking.date}
          </li>
        ))}
      </ul>

      <h2>Your Favorite Adventures</h2>
      <ul className="favorites-list">
        {favorites.map((favorite) => (
          <li key={favorite._id} className="favorite-item">{favorite.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProfilePage;
