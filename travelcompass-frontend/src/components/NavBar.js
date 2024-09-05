// TRAVELCOMPASS-FRONEND/src/components/NavBar.js
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import AuthModal from '../components/AuthModal';
import "../styles/NavBar.css";
import { Globe, HelpCircle, User, Menu } from 'react-feather';
import logo from '../assets/images/TravelCompassLogo.png';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLangOpen, setLangOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleLangMenu = () => setLangOpen(!isLangOpen);
  const toggleMenu = () => setMenuOpen(!isMenuOpen);

  const openModal = (tab) => {
    setActiveTab(tab);
    setModalOpen(true);
  };

  return (
    <>
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
                <Link key={index} to={`/change-language/${lang}`} className="dropdown-item">
                  <span role="img" aria-label={lang}>{getFlagEmoji(lang)}</span> {lang.toUpperCase()}
                </Link>
              ))}
            </div>
          </div>

          <div className="navbar-item help-icon" title="Need Help?">
            <HelpCircle />
          </div>

          <div className="navbar-item">
            {!user ? (
              <Link to="/become-provider" className="nav-link">List Your Adventure</Link>
            ) : user?.roles?.includes('provider') ? (

              <Link to={`/provider-dashboard/${user.provider}`} className="nav-link">Provider Dashboard</Link>
            ) : user?.roles?.includes('admin') ? (
              <Link to="/admin-dashboard" className="nav-link">Admin Dashboard</Link>
            )
            : <Link to="/become-provider" className="nav-link">List Your Adventure</Link>
            }
          </div>

          <div className="navbar-item user-icon" onClick={toggleMenu}>
            <User />
            <div className={`dropdown-content ${isMenuOpen ? 'show' : ''}`}>
              {!user ? (
                <>
                  <Link to="/login" className="nav-link">Login</Link>
                  <Link to="/register" className="nav-link">Register</Link>

                </>
              ) : (
                <>
                  <Link to="/profile" className="nav-link">Profile</Link>
                  {user?.roles?.includes('provider') ? (
                    <Link to={`/provider-dashboard/${user.provider}`} className="nav-link">Provider Dashboard</Link>
                  ) : user?.roles?.includes('admin') ? (
                    <Link to="/admin-dashboard" className="nav-link">Admin Dashboard</Link>
                  ) :  <Link to="/become-provider" className="nav-link">List Your Adventure</Link>
                  }
                  <Link to="/support" className="nav-link">Get Help</Link>
                  <span className="nav-link" onClick={handleLogout}>Logout</span>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <AuthModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} activeTab={activeTab} />
    </>
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
