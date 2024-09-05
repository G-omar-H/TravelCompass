import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SearchFilter from '../components/SearchFilter';
import FavoriteButton from '../components/FavoriteButton';
import StarRating from '../components/StarRating';
import '../styles/AdventureList.css';

const AdventureList = () => {
  const [adventures, setAdventures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdventures = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/adventures`);
        setAdventures(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching adventures:', error);
        setLoading(false);
      }
    };
    fetchAdventures();
  }, []);

  return (
      <div className="adventure-list-background">
        <div className="container">
          <SearchFilter setAdventures={setAdventures} />
          <p className="adventure-list-title">Featured Adventures</p>
          <div className="adventure-grid">
            {loading ? (
                // Loading skeletons
                [...Array(6)].map((_, index) => (
                    <div key={index} className="adventure-card loading-skeleton">
                      <div className="skeleton-img"></div>
                      <div className="skeleton-text title"></div>
                      <div className="skeleton-text"></div>
                      <div className="skeleton-text"></div>
                      <div className="skeleton-button"></div>
                    </div>
                ))
            ) : (
                adventures.map((adventure) => (
                    <Link to={`/adventure/${adventure._id}`} key={adventure._id} className="adventure-card-link">
                      <div className="adventure-card minimalist-style">
                        <div className="image-container">
                          <img src={adventure.photos[0]} alt={adventure.title} className="adventure-image" />
                          <div className="adventure-duration">
                            {adventure.duration} Days
                          </div>
                          <FavoriteButton adventureId={adventure._id} />
                        </div>
                        <div className="adventure-info">
                          <h3>{adventure.title}</h3>
                          <div className="adventure-meta">
                            <StarRating reviews={adventure.reviews} />
                            <span className="review-count">({adventure.reviews.length})</span>
                            <p className="adventure-location">{adventure.location}</p>
                          </div>
                          {/* Removed price for minimalism */}
                        </div>
                      </div>
                    </Link>
                ))
            )}
          </div>
        </div>
      </div>
  );
};

export default AdventureList;