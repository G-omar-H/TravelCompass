import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import UserProfile from './pages/UserProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import AdventureList from './pages/AdventureList';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { user } = useContext(AuthContext);
  return (
    <Route {...rest} render={props => (
      user ? <Component {...props} /> : <Redirect to="/login" />
    )} />
  );
};

function App() {
  return (
    <Router>
      <switch>
        <div className="App">
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/profile" component={UserProfile} />
          <PrivateRoute path="/adventures" component={AdventureList} />
        </div>
      </switch>
    </Router>
  );
}

export default App;
