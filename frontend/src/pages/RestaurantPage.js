import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RestaurantPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login'); // Rediriger si non connecté
    }

    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('http://localhost:3000/restaurants', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRestaurants(response.data);
      } catch (err) {
        setError('Erreur lors du chargement des restaurants');
      }
    };

    fetchRestaurants();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6">
        <h1 className="text-3xl font-bold mb-4">Mes Restaurants</h1>
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              className="bg-white p-4 rounded-lg shadow-md"
            >
              <h3 className="text-xl font-semibold">
                {restaurant.cuisineType}
              </h3>
              <p>Restaurant ID: {restaurant._id}</p>
              <button
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                onClick={() => navigate(`/restaurant/${restaurant._id}`)}
              >
                Voir Détails
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RestaurantPage;
