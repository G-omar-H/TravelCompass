import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Search, Calendar, Users, MapPin } from 'react-feather';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/SearchFilter.css';

const loadGoogleMapsAPI = (callback) => {
    const existingScript = document.getElementById('googleMaps');

    if (!existingScript) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.id = 'googleMaps';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        script.onload = () => {
            if (callback) callback();
        };

        script.onerror = () => {
            console.error('Failed to load Google Maps API');
        };
    } else {
        if (callback) callback();
    }
};

const SearchFilter = ({ setAdventures }) => {
    const [location, setLocation] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [people, setPeople] = useState({ adults: 1, children: 0, infants: 0 });
    const [error, setError] = useState('');
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setIsDropdownVisible(!isDropdownVisible);

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/adventures`, {
                params: { location, startDate, endDate, people },
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
                <MapPin className="search-icon"/>
                <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Where are you going?"
                />
            </div>

            <div className="search-field date-range">
                <Calendar className="search-icon"/>
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="Check-in"
                />
                <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="Check-out"
                />
            </div>

            <div className="search-field" ref={dropdownRef}>
                <Users className="search-icon"/>
                <input
                    type="text"
                    placeholder="Guests"
                    value={`${people.adults} Adults, ${people.children} Children, ${people.infants} Infants`}
                    onClick={toggleDropdown}
                    readOnly
                />
                {isDropdownVisible && (
                    <div className="people-picker-dropdown">
                        {['adults', 'children', 'infants'].map((personType) => (
                            <div key={personType}>
                                <label>{personType.charAt(0).toUpperCase() + personType.slice(1)}</label>
                                <button onClick={() => setPeople({...people, [personType]: people[personType] - 1})}>
                                    -
                                </button>
                                <span>{people[personType]}</span>
                                <button onClick={() => setPeople({...people, [personType]: people[personType] + 1})}>
                                    +
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button className="search-button">
                <Search className="magnet"/>
            </button>

            {error && <div className="error-message">{error}</div>}
        </form>
    );
};

export default SearchFilter;