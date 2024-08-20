// TRAVELCOMPASS-FRONTEND/src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get(`${process.env.REACT_APP_API_URL}/users/profile`).then(response => {
        setUser(response.data);
      }).catch(() => {
        setUser(null);
      });
    } else {
      setUser(null);
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/login`, { email, password });
      setToken(response.data.token);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };
  
  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/register`, { name, email, password });
      setToken(response.data.token);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
    } catch (error) {
      console.error('Error registering:', error);
    }
  };
  
  const logout = () => {
    try {
      setToken(null);
      localStorage.removeItem('token');
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};