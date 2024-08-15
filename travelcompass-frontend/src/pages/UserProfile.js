// TRAVELCOMPASS-FRONTEND/src/pages/UserProfile.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [savedAdventures, setSavedAdventures] = useState([]);
  const [bookingHistory, setBookingHistory] = useState([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data } = await axios.get('/api/users/profile');
      setUser(data);
      setName(data.name);
      setEmail(data.email);
      setSavedAdventures(data.savedAdventures);
      setBookingHistory(data.bookingHistory);
    };

    fetchUserProfile();
  }, []);

  const updateUserProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/users/profile', { name, email, password });
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update profile.');
    }
  };

  return (
    <div>
      <h1>User Profile</h1>
      {user && (
        <form onSubmit={updateUserProfile}>
          <div>
            <label>Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit">Update Profile</button>
        </form>
      )}

      <h2>Saved Adventures</h2>
      <ul>
        {savedAdventures.map((adventure) => (
          <li key={adventure._id}>{adventure.title}</li>
        ))}
      </ul>

      <h2>Booking History</h2>
      <ul>
        {bookingHistory.map((booking) => (
          <li key={booking._id}>
            {booking.adventure.title} - {new Date(booking.date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserProfile;
