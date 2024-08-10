import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav>
      {/* Other navigation links */}
      <Link to="/profile">Profile</Link>
    </nav>
  );
};

export default NavBar;
