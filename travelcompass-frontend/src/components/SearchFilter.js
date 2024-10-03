import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Calendar, Users, MapPin } from 'react-feather';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PlacesAutocomplete from 'react-places-autocomplete';
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
    const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadGoogleMapsAPI(() => {
            setIsGoogleMapsLoaded(true);
            setLoading(false);
            console.log('Google Maps API loaded successfully');
        });
    }, []);

    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    const handleSelectLocation = (address) => {
        setLocation(address);
    };

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
                <MapPin className="search-icon" />
                {isGoogleMapsLoaded ? (
                    <PlacesAutocomplete value={location} onChange={setLocation} onSelect={handleSelectLocation}>
                        {({ getInputProps, suggestions, getSuggestionItemProps }) => (
                            <div>
                                <input {...getInputProps({ placeholder: 'Where are you going?' })} />
                                <div className="autocomplete-dropdown">
                                    {suggestions.map((suggestion) => (
                                        <div key={suggestion.placeId} {...getSuggestionItemProps(suggestion)}>
                                            {suggestion.description}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </PlacesAutocomplete>
                ) : loading ? (
                    <input placeholder="Loading location..." disabled />
                ) : (
                    <input placeholder="Google Maps API not loaded." disabled />
                )}
            </div>

            <div className="search-field">
                <Calendar className="search-icon" />
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

            <div className="search-field">
                <Users className="search-icon" />
                <input
                    type="text"
                    placeholder="Guests"
                    value={`${people.adults} Adults, ${people.children} Children, ${people.infants} Infants`}
                    onClick={toggleDropdown}
                    readOnly
                />
                {isDropdownVisible && (
                    <div className="people-picker-dropdown">
                        <div>
                            <label>Adults</label>
                            <button onClick={() => setPeople({ ...people, adults: Math.max(1, people.adults - 1) })}>-</button>
                            <span>{people.adults}</span>
                            <button onClick={() => setPeople({ ...people, adults: people.adults + 1 })}>+</button>
                        </div>
                        <div>
                            <label>Children</label>
                            <button onClick={() => setPeople({ ...people, children: Math.max(0, people.children - 1) })}>-</button>
                            <span>{people.children}</span>
                            <button onClick={() => setPeople({ ...people, children: people.children + 1 })}>+</button>
                        </div>
                        <div>
                            <label>Infants</label>
                            <button onClick={() => setPeople({ ...people, infants: Math.max(0, people.infants - 1) })}>-</button>
                            <span>{people.infants}</span>
                            <button onClick={() => setPeople({ ...people, infants: people.infants + 1 })}>+</button>
                        </div>
                    </div>
                )}
            </div>

            <button type="submit" className="search-button">
                <Search className="search-icon magnet" />
                Search
            </button>
            {error && <p className="error-message">{error}</p>}
        </form>
    );
};

export default SearchFilter;
