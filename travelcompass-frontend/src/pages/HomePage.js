import React from 'react';
import { Link } from 'react-router-dom';
import AdventureList from './AdventureList';

const HomePage = () => {
  return (
    <div className="home-page">
      <h1>Welcome to Travel Compass!</h1>
      <p>Find your next adventure or offer your services to travelers.</p>
      <div className="cta-buttons">
        <Link to="/find-services" className="cta-button">Find Services</Link>
        <Link to="/become-provider" className="cta-button">Become a Provider</Link>
      </div>
    </div>
  );
};

export default HomePage;
