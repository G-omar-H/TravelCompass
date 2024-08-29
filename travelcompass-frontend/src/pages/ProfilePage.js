import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await axios.get(`${process.env.REACT_APP_API_URL}/users/profile`);
        setUser(userData.data);
        setName(userData.data.name);
        setEmail(userData.data.email);

        const bookingsData = await axios.get(`${process.env.REACT_APP_API_URL}/users/profile/bookings`);
        setBookings(bookingsData.data);

        const favoritesData = await axios.get(`${process.env.REACT_APP_API_URL}/users/profile/favorites`);
        setFavorites(favoritesData.data);
      } catch (error) {
        setError('Error fetching profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/users/profile`, { name, email, password });
      navigate('/profile');
    } catch (error) {
      setError('Error updating profile');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="profile-page">
      <h1 className="profile-heading">Profile</h1>
      {error && <div className="error-message">{error}</div>}
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
          <label>Password (optional):</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="update-button">Update</button>
      </form>

      <section className="profile-info">
        <h2>Bookings</h2>
        <ul className="list">
          {bookings.map((booking) => (
            <li key={booking._id} className="list-item">
              {booking.adventure} on {booking.date}
            </li>
          ))}
        </ul>

        <h2>Favorites</h2>
        <ul className="list">
          {favorites.map((favorite) => (
            <li key={favorite._id} className="list-item">
              {favorite.title}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default ProfilePage;
