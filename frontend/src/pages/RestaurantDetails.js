import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const RestaurantDetails = () => {
  const { commercantId } = useParams(); // ID du commerçant
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Si le token n'existe pas, rediriger vers la page de connexion
      navigate("/login");
    }

    const fetchRestaurantDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/etablissements/restaurant/${commercantId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRestaurant(response.data.restaurant);
      } catch (err) {
        setError("Erreur de récupération des détails du restaurant");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [commercantId, navigate]);

  if (loading) {
    return <div className="text-center p-4">Chargement...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  if (!restaurant) {
    return <div className="text-center p-4 text-red-500">Restaurant non trouvé</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-semibold mb-4">{restaurant.nom}</h1>
      <p className="text-xl text-gray-700 mb-2"><strong>Type:</strong> {restaurant.type}</p>
      <p className="text-xl text-gray-700 mb-2"><strong>Commerçant:</strong> {restaurant.idCommercant.nom}</p>
      <p className="text-xl text-gray-700 mb-4"><strong>Email:</strong> {restaurant.idCommercant.email}</p>

      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-2">QR Code:</h2>
        <img src={restaurant.qr_code_url} alt="QR Code" className="max-w-xs" />
      </div>
    </div>
  );
};

export default RestaurantDetails;
