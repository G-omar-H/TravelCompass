import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [adventures, setAdventures] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await axios.get('/api/admin/users');
      setUsers(data);
    };

    const fetchAdventures = async () => {
      const { data } = await axios.get('/api/admin/adventures');
      setAdventures(data);
    };

    const fetchBookings = async () => {
      const { data } = await axios.get('/api/admin/bookings');
      setBookings(data);
    };

    const fetchProviders = async () => {
      const { data } = await axios.get('/api/admin/providers');
      setProviders(data);
    };

    fetchUsers();
    fetchAdventures();
    fetchBookings();
    fetchProviders();
  }, []);

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await axios.delete(`/api/admin/users/${id}`);
      setUsers(users.filter((user) => user._id !== id));
    }
  };

  const handleDeleteAdventure = async (id) => {
    if (window.confirm('Are you sure you want to delete this adventure?')) {
      await axios.delete(`/api/admin/adventures/${id}`);
      setAdventures(adventures.filter((adventure) => adventure._id !== id));
    }
  };

  const handleDeleteProvider = async (id) => {
    if (window.confirm('Are you sure you want to delete this provider?')) {
      await axios.delete(`/api/admin/providers/${id}`);
      setProviders(providers.filter((provider) => provider._id !== id));
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <section>
        <h2>Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              {user.name} - {user.email} <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Adventures</h2>
        <ul>
          {adventures.map((adventure) => (
            <li key={adventure._id}>
              {adventure.title} <button onClick={() => handleDeleteAdventure(adventure._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Bookings</h2>
        <ul>
          {bookings.map((booking) => (
            <li key={booking._id}>
              {booking.user.name} - {booking.adventure.title}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Providers</h2>
        <ul>
          {providers.map((provider) => (
            <li key={provider._id}>
              {provider.name} <button onClick={() => handleDeleteProvider(provider._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>

      <Link to="/create-adventure">Create Adventure</Link>
    </div>
  );
};

export default AdminDashboard;
