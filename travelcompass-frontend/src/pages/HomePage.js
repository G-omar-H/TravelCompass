import React from 'react';
import AdventureList from '../pages/AdventureList';
import "../styles/HomePage.css";

const HomePage = () => {
  return (
      <div className="home-page">
          {/* Hero Section */}
          <div className="hero-section">
              <div className="container">
                  <div className="hero-text">
                      <h1>Find Your Next Adventure</h1>
                      <p>Where Will Your Compass Lead You?</p>
                  </div>
              </div>
          </div>

          {/* Featured Adventures */}
          <div className="featured-adventures">
              <div className="container">
                  <AdventureList/>
              </div>
          </div>
      </div>

  );
};

export default HomePage;
