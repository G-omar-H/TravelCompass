import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminCreateAdventure from '../components/AdminCreateAdventure';
import '../styles/AdminDashboard.css'; // Import the CSS file for styling

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [adventures, setAdventures] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [providers, setProviders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdventure, setSelectedAdventure] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, adventuresRes, bookingsRes, providersRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/admin/users`),
          axios.get(`${process.env.REACT_APP_API_URL}/admin/adventures`),
          axios.get(`${process.env.REACT_APP_API_URL}/admin/bookings`),
          axios.get(`${process.env.REACT_APP_API_URL}/admin/providers`)
        ]);

        setUsers(usersRes.data);
        setAdventures(adventuresRes.data);
        setBookings(bookingsRes.data);
        setProviders(providersRes.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert('You are not authorized to view this page');
        } else {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (type, id, setter, data) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/admin/${type}/${id}`);
        setter(data.filter(item => item._id !== id));
      } catch (error) {
        console.error(`Error deleting ${type}:`, error);
      }
    }
  };

  const handleEdit = (adventure) => {
    setSelectedAdventure(adventure);
    setIsModalOpen(true);
  };

  return (
      <div className="admin-dashboard container">
        <h1>Admin Dashboard</h1>

        <section className="admin-section">
          <h2>Users</h2>
          <ul>
            {users.map(user => (
                <li key={user._id} className="admin-item">
                  {user.name} - {user.email}
                  <button onClick={() => handleDelete('users', user._id, setUsers, users)}>Delete</button>
                </li>
            ))}
          </ul>
        </section>

        <section className="admin-section">
          <h2>Adventures</h2>
          <ul>
            {adventures.map(adventure => (
                <li key={adventure._id} className="admin-item" onClick={() => handleEdit(adventure)}>
                  {adventure.title}
                  <button onClick={() => handleDelete('adventures', adventure._id, setAdventures, adventures)}>Delete</button>
                </li>
            ))}
          </ul>
        </section>

        <section className="admin-section">
          <h2>Bookings</h2>
          <ul>
            {bookings.map(booking => (
                <li key={booking._id} className="admin-item">
                  {booking.user.name} - {booking.adventure.title} - {new Date(booking.date).toLocaleDateString()}
                </li>
            ))}
          </ul>
        </section>

        <section className="admin-section">
          <h2>Providers</h2>
          <ul>
            {providers.map(provider => (
                <li key={provider._id} className="admin-item">
                  {provider.name}
                  <button onClick={() => handleDelete('providers', provider._id, setProviders, providers)}>Delete</button>
                </li>
            ))}
          </ul>
        </section>

        <button onClick={() => { setSelectedAdventure(null); setIsModalOpen(true); }}>Create New Adventure</button>

        {isModalOpen && (
            <AdminCreateAdventure setIsModalOpen={setIsModalOpen} selectedAdventure={selectedAdventure} />
        )}
      </div>
  );
};

export default AdminDashboard;