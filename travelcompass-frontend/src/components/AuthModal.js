// TRAVELCOMPASS-FRONTEND/src/components/AuthModal.js
import React, { useState } from 'react';
import Login from '../pages/Login';
import Register from '../pages/Register';
import '../styles/AuthModal.css';

const AuthModal = ({ isOpen, onClose, activeTab: initialActiveTab }) => {
  const [activeTab, setActiveTab] = useState(initialActiveTab);

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-tabs">
          <span
            className={`tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </span>
          <span
            className={`tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Register
          </span>
        </div>

        <div className="auth-modal-body">
          {activeTab === 'login' ? <Login onClose={onClose} /> : <Register onClose={onClose} />}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
