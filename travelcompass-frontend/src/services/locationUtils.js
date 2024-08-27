import axios from 'axios';

export const getReadableAddress = async (coordinates) => {
    const [latitude, longitude] = coordinates;
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      const address = data.results[0]?.formatted_address;
      return address || 'Location not available';
    } catch (error) {
      console.error('Error getting location:', error);
      return 'Location not available';
    }
  };