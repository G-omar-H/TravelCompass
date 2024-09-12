import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (accessToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      axios.get(`${process.env.REACT_APP_API_URL}/users/profile`).then(response => {
        setUser(response.data);
      }).catch((err) => {
        if (err.response.status === 401) {
          // Token expired, try to refresh
          refreshAccessToken();
        } else {
          setUser(null);
        }
      });
    } else {
      setUser(null);
    }
  }, [accessToken]);

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/refresh-token`, { refreshToken });
      setAccessToken(response.data.accessToken);
      localStorage.setItem('accessToken', response.data.accessToken);
    } catch (error) {
      console.error('Error refreshing access token:', error);
      logout();
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/login`, { email, password });
      setAccessToken(response.data.accessToken);
      setRefreshToken(response.data.refreshToken);
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      setUser(response.data.user);
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/register`, { name, email, password });
      setAccessToken(response.data.accessToken);
      setRefreshToken(response.data.refreshToken);
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      setUser(response.data.user);
    } catch (error) {
      setError('Registration error');
    }
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return (
      <AuthContext.Provider value={{ user, login, register, logout }}>
        {children}
      </AuthContext.Provider>
  );
};
