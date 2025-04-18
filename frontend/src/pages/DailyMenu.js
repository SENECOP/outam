import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAppContext } from '../context/AppContext';
import { useNavigate } from "react-router-dom";

const DesktopDailyMenu = () => {
  const { restaurantId } = useParams();
    const [activeMenu, setActiveMenu] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { currentRestaurant } = useAppContext();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
  
        const restaurantRes = await axios.get(`https://outam.onrender.com/api/restaurant/${restaurantId}`);
        const restaurant = restaurantRes.data;
  
        // ✅ Vérifie si le menu est visible
        if (!restaurant.qrCodeEnabled || !restaurant.isMenuActive) {

          setError("Ce menu n'est pas disponible pour le moment.");
          return;
        }
  
        const menuRes = await axios.get(
          `https://outam.onrender.com/api/restaurant/${restaurantId}/menus/active`,
          {
            timeout: 5000,
            headers: { "Cache-Control": "no-cache" },
          }
        );
  
        if (menuRes.data?.menu) {
          setActiveMenu(menuRes.data.menu);
          setDishes(menuRes.data.menu.dishes || []);
        } else {
          setError(menuRes.data?.message || "Aucun menu actif disponible.");
        }
  
      } catch (err) {
        setError("Impossible de charger les données du menu.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  
    // ✅ Recharger automatiquement après activation (ex: toutes les 10 secondes)
    const interval = setInterval(() => {
      fetchData();
    }, 10000); // 10 secondes
  
    return () => clearInterval(interval);
  }, [restaurantId]);
  

  const categories = [
    "Tous",
    "Petit-déjeuner",
    "Lunch",
    "Dinner",
    "Plat du jour",
    "Dessert",
  ];

  const filteredDishes = dishes.filter(
    (dish) =>
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
      <div className="p-4 text-center text-red-500 text-sm">{error}</div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
  {/* Logo du restaurant à gauche */}
  {currentRestaurant?.logo && (
    <img
      src={currentRestaurant.logo}
      alt="Logo du restaurant"
      className="h-12 w-12 object-cover rounded-full"
      onError={(e) => {
        e.target.src = "/images/default-logo.jpg"; // Logo fallback si l'image échoue
      }}
    />
  )}

  {/* Titre de bienvenue */}
  <h3 className="text-2xl font-bold text-center">
    Bienvenue au restaurant {currentRestaurant?.name || "Restaurant"}
  </h3>

  {/* Logo du projet à droite */}
  <img
    src="https://outam.onrender.com/assets/logo.png" // Remplace cette URL par le chemin vers ton logo de projet
    alt="Logo du projet"
    className="h-12 w-12 object-cover rounded-full"
    onError={(e) => {
      e.target.src = "/images/default-project-logo.jpg"; // Logo fallback si l'image échoue
    }}
  />
</div>



      {/* Info sur le menu actif */}
      {/* {activeMenu && (
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h2 className="text-xl font-semibold text-yellow-800">{activeMenu.title}</h2>
          {activeMenu.description && (
            <p className="text-sm text-gray-600 mt-1">{activeMenu.description}</p>
          )}
          <p className="text-xs text-yellow-600 mt-2">
            Menu actif • {new Date(activeMenu.createdAt).toLocaleDateString()}
          </p>
        </div>
      )} */}

      {/* Barre de recherche */}
      {/* <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Rechercher un plat..."
          className="flex-1 p-2 border rounded-lg text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div> */}

      {/* Catégories */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 text-sm rounded-full transition-all ${
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

      {/* Galerie responsive des plats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredDishes.length > 0 ? (
          filteredDishes.map((dish) => (
            <div
              key={dish._id}
              className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden cursor-pointer"
              onClick={() => navigate(`/restaurant/${restaurantId}/dish/${dish._id}`)}
            >
              {/* Conteneur d'image avec ratio fixe */}
              <div className="relative pt-[75%] overflow-hidden">
                {dish.image ? (
                  <img
                    src={
                      dish.image.startsWith("http")
                        ? dish.image
                        : `https://outam.onrender.com${dish.image}`
                    }
                    alt={dish.title}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x225?text=Image+Manquante";
                      e.target.className = "absolute top-0 left-0 w-full h-full object-contain p-4 bg-gray-100";
                    }}
                  />
                ) : (
                  <div className="absolute top-0 left-0 w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Pas d'image</span>
                  </div>
                )}
              </div>
              
              <div className="p-3 space-y-1">
  <h3 className="text-base font-semibold truncate">
    {dish.title || "Sans titre"}
  </h3>
  {dish.description && (
    <p className="text-sm text-gray-600 line-clamp-2">{dish.description}</p>
  )}
  <p className="text-yellow-600 text-sm font-bold">
    {dish.price} Fcfa
  </p>
  <p className="text-xs text-gray-500">{dish.category}</p>
</div>

            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 text-sm">
            Aucun plat disponible dans ce menu
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 border-t pt-4 text-center text-xs text-gray-400">
        <p>OUTAM</p>
        <p>Votre publicité avec</p>
        <p className="font-semibold">outam</p>
      </div>
    </div>
  );
};

export default DesktopDailyMenu;