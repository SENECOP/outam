import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const MobileDailyMenu = () => {
  const { id: restaurantId } = useParams();
  const [dailyMenus, setDailyMenus] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDailyMenu = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(
          `https://outam.onrender.com/api/restaurant/${restaurantId}/daily-menu`,
          {
            timeout: 5000,
            headers: { 'Cache-Control': 'no-cache' }
          }
        );

        if (response.data?.dailyMenus?.[0]?.dishes) {
          setDailyMenus(response.data.dailyMenus[0].dishes);
        } else {
          setDailyMenus([]);
          setError("Aucun menu disponible");
        }
      } catch (error) {
        setError(error.response?.data?.message || "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };
  
    if (restaurantId) fetchDailyMenu();
  }, [restaurantId]);

  const categories = ["Tous", "Petit-déjeuner", "Lunch", "Dinner", "Plat du jour", "Dessert"];

  const filteredMenus = dailyMenus.filter((dish) =>
    (selectedCategory === "Tous" || dish.category === selectedCategory) &&
    dish.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="p-3 max-w-md mx-auto">
      {/* En-tête */}
      <h1 className="text-center text-lg font-bold mb-3">Bienvenue à SENTASTE</h1>

      {/* Barre de recherche */}
      <input
        type="text"
        placeholder="Search recipes..."
        className="w-full p-2 mb-3 border rounded-lg text-sm"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Catégories scrollables */}
      <div className="mb-3">
  {/* Première ligne de catégories */}
  <div className="flex space-x-2 overflow-x-auto pb-2 mb-2">
    {categories.slice(0, 3).map((category) => (
      <button
        key={category}
        className={`px-3 py-1 text-xs rounded-full whitespace-nowrap flex-shrink-0 ${
          selectedCategory === category 
            ? "bg-yellow-500 text-white" 
            : "bg-gray-200 text-gray-700"
        }`}
        onClick={() => setSelectedCategory(category)}
      >
        {category}
      </button>
    ))}
  </div>

  {/* Deuxième ligne de catégories */}
  <div className="flex space-x-2 overflow-x-auto pb-2">
    {categories.slice(3).map((category) => (
      <button
        key={category}
        className={`px-3 py-1 text-xs rounded-full whitespace-nowrap flex-shrink-0 ${
          selectedCategory === category 
            ? "bg-yellow-500 text-white" 
            : "bg-gray-200 text-gray-700"
        }`}
        onClick={() => setSelectedCategory(category)}
      >
        {category}
      </button>
    ))}
  </div>
</div>

      {/* Liste des plats */}
      <div className="space-y-2">
        {filteredMenus.length > 0 ? (
          filteredMenus.map((dish) => (
            <div key={dish._id} className="bg-white p-2 rounded-lg shadow-sm flex items-center">
              <img
                src={dish.image?.startsWith("http") ? dish.image : `https://outam.onrender.com${dish.image}`}
                alt={dish.title}
                className="w-12 h-12 rounded-lg object-cover mr-2"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/48?text=Image";
                }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium truncate">{dish.title || "Sans titre"}</h3>
                <div className="flex justify-between">
                  <span className="text-yellow-600 text-xs">{dish.price}Fcfa</span>
                  <span className="text-gray-500 text-xs">{dish.category}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500 text-sm">
            Aucun plat disponible
          </div>
        )}
      </div>

      {/* Espace pub */}
      <div className="mt-4 pt-2 border-t text-center text-xs text-gray-400">
        <p>OUTAM</p>
        <p>Votre publicité avec</p>
        <p className="font-medium">outam</p>
      </div>
    </div>
  );
};

export default MobileDailyMenu;