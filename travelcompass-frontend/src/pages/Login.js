// TRAVELCOMPASS-FRONTEND/src/pages/Login.js
import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';  // Import the CSS file

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State to hold error message
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any existing errors

    try {
      await login(email, password);
      navigate('/'); // Redirect to home page on successful login
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          setError('Invalid credentials. Please try again.');
        } else {
          setError(`Error: ${err.response.status} - ${err.response.data.message || 'Unexpected error'}`);
        }
      } else if (err.request) {
        setError('Network error. Please try again.');
      } else {
        setError('Unexpected error. Please try again.');
      }
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>} {/* Display error message */}
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email" 
          required 
          className="login-input"
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password" 
          required 
          className="login-input"
        />
        <button type="submit" className="login-button">Login</button>
        <p className="login-register-link">Don't have an account? <a href="/register">Register</a></p>
      </form>
    </div>
  );
};

export default Login;
