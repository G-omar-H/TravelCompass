// TRAVELCOMPASS-FRONTEND/src/components/NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user }) => {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/adventures">Adventures</Link>
      {user && user.isAdmin && <Link to="/admin-dashboard">Admin Dashboard</Link>}
      {user ? (
        <Link to="/profile">Profile</Link>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
};

export default Navbar;
