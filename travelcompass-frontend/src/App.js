// TRAVELCOMPASS-FRONTEND/src/App.js
import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import UserProfile from './pages/UserProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import AdventureList from './pages/AdventureList';
import AdventureDetails from './pages/AdventureDetails';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, ...rest }) => {
  const { user } = useContext(AuthContext);
  return user ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/adventures">Adventures</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          </ul>
        </nav>
        <h1>Travel Compass</h1>
        <hr />
        <h2>Welcome to Travel Compass!</h2>
        <p>Find your next adventure here.</p>
        <hr />
        <h2>Routes</h2>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<PrivateRoute element={<UserProfile />} />} />
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
