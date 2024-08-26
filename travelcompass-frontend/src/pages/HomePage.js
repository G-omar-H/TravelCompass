import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AdventureList from './AdventureList';
import {AuthContext} from "../contexts/AuthContext";

const HomePage = () => {
  const { user } = useContext(AuthContext);
    function getProviderLink() {
      return user ? "/become-provider" : "/login";
    }

    return (
    <div className="home-page">
      <h1>Welcome to Travel Compass!</h1>
      <p>Find your next adventure or offer your services to travelers.</p>
      <div className="cta-buttons">
        <Link to="/find-services" className="cta-button">Find Services</Link>
        {(user && user.roles && user.roles.includes("provider")) ? (
          <Link to={`/provider-dashboard/${user.provider}`} className="cta-button">Provider Dashboard</Link>
        ) : (
          <Link to={getProviderLink()} className="cta-button">Become a Provider</Link>
        )}
      </div>
    </div>
  );
};

export default HomePage;
