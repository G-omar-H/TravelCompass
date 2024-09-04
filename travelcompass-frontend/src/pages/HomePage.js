import React from 'react';
import SearchFilter from '../components/SearchFilter';
import AdventureList from '../pages/AdventureList';
import "../styles/HomePage.css";

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-text">
          <h1>Find Your Next Adventure</h1>
          <p>Where Will Your Compass Lead You?</p>
        </div>
        <div className="search-filter-container">
        </div>
      </div>
      {/* Featured Adventures Section */}
      <div className="featured-adventures">
        <AdventureList />
      </div>
    </div>
  );
};

export default HomePage;
