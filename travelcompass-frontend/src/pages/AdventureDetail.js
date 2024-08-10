import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookingForm from '../components/BookingForm';

const AdventureDetail = ({ match }) => {
  const [adventure, setAdventure] = useState(null);

  useEffect(() => {
    const fetchAdventure = async () => {
      const response = await axios.get(`/api/adventures/${match.params.id}`);
      setAdventure(response.data);
    };
    fetchAdventure();
  }, [match.params.id]);

  if (!adventure) return <div>Loading...</div>;

  return (
    <div>
      <h1>{adventure.title}</h1>
      <p>{adventure.description}</p>
      <p>Location: {adventure.location}</p>
      <p>Price: ${adventure.price}</p>
      <BookingForm adventureId={adventure._id} />
    </div>
  );
};

export default AdventureDetail;
