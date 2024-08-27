// TRAVELCOMPASS-FRONTEND/src/pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdminCreateAdventure from '../components/AdminCreateAdventure';


const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [adventures, setAdventures] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [providers, setProviders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/admin/users`);
        setUsers(data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert('You are not authorized to view this page');
        } else {
          console.error('Error fetching users:', error);
        }
      }
    };

    const fetchAdventures = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/admin/adventures`);
        setAdventures(data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert('You are not authorized to view this page');
        } else {
          console.error('Error fetching adventures:', error);
        }
      }
    };

    const fetchBookings = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/admin/bookings`);
        setBookings(data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert('You are not authorized to view this page');
        } else {
          console.error('Error fetching bookings:', error);
        }
      }
    };

    const fetchProviders = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/admin/providers`);
        setProviders(data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert('You are not authorized to view this page');
        } else {
          console.error('Error fetching providers:', error);
        }
      }
    };

    fetchUsers();
    fetchAdventures();
    fetchBookings();
    fetchProviders();
  }, []);

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/admin/users/${id}`);
        setUsers(users.filter((user) => user._id !== id));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleDeleteAdventure = async (id) => {
    if (window.confirm('Are you sure you want to delete this adventure?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/admin/adventures/${id}`);
        setAdventures(adventures.filter((adventure) => adventure._id !== id));
      } catch (error) {
        console.error('Error deleting adventure:', error);
      }
    }
  };

  const handleDeleteProvider = async (id) => {
    if (window.confirm('Are you sure you want to delete this provider?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/admin/providers/${id}`);
        setProviders(providers.filter((provider) => provider._id !== id));
      } catch (error) {
        console.error('Error deleting provider:', error);
      }
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
              {booking.user.name} - {booking.adventure.title} - {booking.date}
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

      <button onClick={() => setIsModalOpen(true)}>Create Adventure</button>
      {isModalOpen && (
        <AdminCreateAdventure
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
