import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import "../styles/NavBar.css";
import { Globe, HelpCircle, Menu } from 'react-feather';
import logo from '../assets/images/TravelCompassLogo.png';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLangOpen, setLangOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleLangMenu = () => setLangOpen(!isLangOpen);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="TravelCompass Logo" className="logo-image" />
          <span className="logo-text">TravelCompass</span>
        </Link>
      </div>

      <div className="navbar-items">
        <div className="navbar-item globe-icon" onClick={toggleLangMenu}>
          <Globe />
          <div className={`dropdown-content ${isLangOpen ? 'show' : ''}`}>
            {['en', 'ar', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko', 'hi', 'ur', 'tr', 'az', 'uk', 'pl'].map((lang, index) => (
              <Link key={index} to={`/change-language/${lang}`}>
                <span role="img" aria-label={lang}>{getFlagEmoji(lang)}</span> {lang.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>

        <div className="navbar-item help-icon" title="Need Help?">
          <HelpCircle />
        </div>

        <div className="navbar-item">
          <button className="cta-button">List Your Adventure</button>
        </div>

        {/* Login/Register Buttons */}
        <div className="navbar-item">
          {!user ? (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Sign Up</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="nav-link">Logout</button>
          )}
        </div>
      </div>
    </nav>
  );
};

const getFlagEmoji = (lang) => {
  const flags = {
    en: '🇺🇸',
    ar: '🇲🇦',
    es: '🇪🇸',
    fr: '🇫🇷',
    de: '🇩🇪',
    it: '🇮🇹',
    pt: '🇵🇹',
    ru: '🇷🇺',
    zh: '🇨🇳',
    ja: '🇯🇵',
    ko: '🇰🇷',
    hi: '🇮🇳',
    ur: '🇵🇰',
    tr: '🇹🇷',
    az: '🇦🇿',
    uk: '🇺🇦',
    pl: '🇵🇱',
  };
  return flags[lang] || '🏳️';
};

export default Navbar;
