import React, { useState } from 'react';
import axios from 'axios';
import "../styles/SearchFilter.css";
import { Search, Calendar, Users, MapPin } from 'react-feather';

const SearchFilter = ({ setAdventures }) => {
  const [location, setLocation] = useState('');
  const [dates, setDates] = useState('');
  const [people, setPeople] = useState({ adults: 1, children: 0, infants: 0 });
  const [error, setError] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/adventures`, {
        params: { location }
      });
      setAdventures(response.data);
    } catch (error) {
      console.error(error);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSearch} className="search-filter">
      <div className="search-field">
        <MapPin className="search-icon" />
        <input
          type="text"
          placeholder="Where?"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div className="search-field">
        <Calendar className="search-icon" />
        <input
          type="text"
          placeholder="Dates"
          value={dates}
          onChange={(e) => setDates(e.target.value)}
        />
      </div>

      <div className="search-field">
        <Users className="search-icon" />
        <input
          type="text"
          placeholder="Who?"
          value={`${people.adults} Adults, ${people.children} Children, ${people.infants} Infants`}
          onClick={toggleDropdown}
          readOnly
        />
        {isDropdownVisible && (
          <div className="people-picker-dropdown">
            <div>
              <label>Adults</label>
              <input
                type="number"
                value={people.adults}
                onChange={(e) => setPeople({ ...people, adults: e.target.value })}
                min="1"
              />
            </div>
            <div>
              <label>Children</label>
              <input
                type="number"
                value={people.children}
                onChange={(e) => setPeople({ ...people, children: e.target.value })}
                min="0"
              />
            </div>
            <div>
              <label>Infants</label>
              <input
                type="number"
                value={people.infants}
                onChange={(e) => setPeople({ ...people, infants: e.target.value })}
                min="0"
              />
            </div>
          </div>
        )}
      </div>

      <button type="submit" className="search-button">
        <Search className="search-icon magnet" />
        Find Adventure
      </button>
      {error && <p className="error-message">{error}</p>}
    </form>
  );
};

export default SearchFilter;