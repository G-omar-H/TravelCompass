import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

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
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (err.response.status === 401) {
          setError('Invalid credentials. Please try again.');
        } else {
          setError(`Error: ${err.response.status} - ${err.response.data.message || 'Unexpected error'}`);
        }
      } else if (err.request) {
        // The request was made but no response was received
        setError('Network error. Please try again.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('Unexpected error. Please try again.');
      } 
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="Email" 
        required 
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder="Password" 
        required 
      />
      <button type="submit">Login</button>
      <p>Don't have an account? <a href="/register">Register</a></p>
    </form>
  );
};

export default Login;
