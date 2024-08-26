// TRAVELCOMPASS-FRONTEND/src/components/NavBar.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import "../styles/NavBar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/adventures">Adventures</Link>
        {user && user.isAdmin && <Link to="/admin-dashboard">Admin Dashboard</Link>}
        {user ? (
            <>
              <Link to="/profile">Profile</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
        ) : (
            <Link to="/login">Login</Link>
        )}
      </nav>
  );
};

export default Navbar;
