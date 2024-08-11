import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<PrivateRoute element={<UserProfile />} />} />
          <Route path="/adventures" element={<AdventureList />} />
          <Route path="/adventure/:id" element={<AdventureDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;