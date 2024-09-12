import { useEffect } from 'react';
import axios from 'axios';

const usePostLoginAction = () => {
    useEffect(() => {
        const addPendingFavorite = async () => {
            const pendingFavorite = localStorage.getItem('pendingFavorite');
            if (pendingFavorite) {
                try {
                    await axios.post(`${process.env.REACT_APP_API_URL}/users/profile/favorites`, { adventureId: pendingFavorite });
                    localStorage.removeItem('pendingFavorite');
                } catch (error) {
                    console.error('Error adding pending favorite:', error);
                }
            }
        };

        addPendingFavorite();
    }, []);
};

export default usePostLoginAction;