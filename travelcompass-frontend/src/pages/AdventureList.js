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
        <h3 className="adventure-list-title">Featured Adventures</h3>
        <div className="adventure-grid">
          {loading ? (
            // Loading skeletons for a better user experience
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
                <div className="adventure-card">
                  <img src={adventure.photos[0]} alt={adventure.title} className="adventure-image" />
                  <div className="adventure-info">
                    <h2>{adventure.title}</h2>
                    <div className="adventure-meta">
                      <div className="adventure-rating">
                        <StarRating reviews={adventure.reviews} />
                        <span>({adventure.reviews.length})</span>
                      </div>
                      <span className="adventure-location">{adventure.location}</span>
                    </div>
                    <p className="adventure-price">From ${adventure.price} / guest</p>
                  </div>
                  <FavoriteButton adventureId={adventure._id} />
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