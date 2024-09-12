import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import usePostLoginAction from '../hooks/usePostLoginAction';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = ({ onClose }) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  usePostLoginAction();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      onClose();
      navigate('/');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Invalid email or password');
      } else {
        setError(err.message);
    }};
  };

  return (
      <div className="container">
    <form onSubmit={handleSubmit} className="login-form ">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
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
      <p className="forgot-password-link">Forgot your password?</p>
    </form>
    </div>
  );
};

export default Login;
