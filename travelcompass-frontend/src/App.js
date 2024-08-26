// TRAVELCOMPASS-FRONTEND/src/App.js
import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import {  AuthContext } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import UserProfile from './pages/UserProfile';
import ProfilePage from './pages/ProfilePage';
import Login from './pages/Login';
import Register from './pages/Register';
import ProviderProfile from './pages/ProviderProfile';
import ProviderDashboard from './pages/ProviderDashboard';
import AdventureList from './pages/AdventureList';
import AdventureDetails from './pages/AdventureDetails';
import Navbar from './components/NavBar';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, ...rest }) => {
  const { user } = useContext(AuthContext);
  return user ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/find-services" element={<AdventureList />} />
          <Route path="/become-provider" element={<ProviderProfile />} />
          <Route path="/provider-dashboard/:id" element={<ProviderDashboard />} />
          <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} />
          <Route path="/adventures" element={<AdventureList />} />
          <Route path="/adventure/:id" element={<AdventureDetails />} />
        </Routes>

        <footer>
          <hr />
          <p>&copy; 2024 Travel Compass</p>
        </footer> 


        
      </div>
    </Router>
  );
}

export default App;
