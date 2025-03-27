import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const GererMenu = () => {
  const { id } = useParams(); // Récupération de l'ID depuis l'URL
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/restaurant/${id}`);
        if (!response.ok) throw new Error("Erreur lors du chargement des données");

        const data = await response.json();
        setRestaurant(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  if (loading) return <p className="text-center text-gray-500">Chargement...</p>;
  if (error) return <p className="text-center text-red-500">Erreur : {error}</p>;
  if (!restaurant) return <p className="text-center text-gray-500">Aucune donnée disponible</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* En-tête du restaurant */}
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="flex items-center p-6">
          <img
            src={restaurant.commercantInfo?.photoDeProfil || "https://via.placeholder.com/80"}
            alt={restaurant.commercantInfo?.name || "Restaurant"}
            className="w-20 h-20 rounded-full object-cover mr-4"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{restaurant.name || "Nom non disponible"}</h1>
            <p className="text-gray-600">Par {restaurant.commercantInfo?.name || "Inconnu"}</p>
            <p className="text-gray-500 text-sm">{restaurant.commercantInfo?.email || "Email non disponible"}</p>
          </div>
        </div>

        {/* Liste des menus */}
        <div className="p-6 border-t border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">Menus</h2>
          {restaurant.menus?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {restaurant.menus.map((menu) => (
                <div
                  key={menu._id}
                  className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">{menu.day}</span>
                    {menu.isActive && (
                      <span className="bg-green-200 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                        Actif
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{menu.name || "Nom du menu"}</h3>
                  <ul className="space-y-4">
                    {menu.dishes?.length > 0 ? (
                      menu.dishes.map((dish) => (
                        <li key={dish._id} className="flex items-center">
                          <img
                            src={dish.image || "https://via.placeholder.com/64"}
                            alt={dish.title || "Plat"}
                            className="w-16 h-16 rounded object-cover mr-4"
                          />
                          <div>
                            <h4 className="text-lg font-semibold text-gray-700">{dish.title || "Titre inconnu"}</h4>
                            <p className="text-gray-500 text-sm">{dish.description || "Aucune description"}</p>
                            <p className="text-gray-800 font-bold mt-1">
                              {dish.price ? `${dish.price.toFixed(2)} FCFA` : "Prix non disponible"}
                            </p>
                          </div>
                        </li>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">Aucun plat disponible</p>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Aucun menu disponible</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GererMenu;
