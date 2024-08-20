// TRAVELCOMPASS-FRONTEND/src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
    <div>
      <h1>User Profile</h1>
      <form onSubmit={handleUpdateProfile}>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Password (leave blank to keep unchanged):</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button type="submit">Update Profile</button>
      </form>

      <h2>Your Bookings</h2>
      <ul>
        {bookings.map((booking) => (
          <li key={booking._id}>
            {booking.adventure.title} on {new Date(booking.date).toLocaleDateString()}
          </li>
        ))}
      </ul>

      <h2>Your Favorite Adventures</h2>
      <ul>
        {favorites.map((favorite) => (
          <li key={favorite._id}>{favorite.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProfilePage;
