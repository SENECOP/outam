import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const DesktopDailyMenu = () => {
  const { restaurantId } = useParams();
  const [activeMenu, setActiveMenu] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [dynamicCategories, setDynamicCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [publicites, setPublicites] = useState([]);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const { currentRestaurant } = useAppContext();

  useEffect(() => {
    const fetchPublicites = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/publicites");
        console.log("Publicités récupérées:", res.data); // Vérifie les données reçues
        if (Array.isArray(res.data) && res.data.length > 0) {
          setPublicites(res.data);
        } else {
          console.log("Aucune publicité trouvée dans la réponse");
        }
      } catch (err) {
        console.error("Erreur lors du chargement des publicités:", err);
      }
    };
  
    fetchPublicites();
  }, []);
  

  // 🔹 Charger les plats
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const restaurantRes = await axios.get(`${apiUrl}/api/restaurant/${restaurantId}`);
        const restaurant = restaurantRes.data;

        if (!restaurant.qrCodeEnabled || !restaurant.isMenuActive) {
          setError("Le restaurant n'est pas ouvert.");
          return;
        }

        const menuRes = await axios.get(`${apiUrl}/api/restaurant/${restaurantId}/menus/active`);
        if (menuRes.data?.menu) {
          setActiveMenu(menuRes.data.menu);
          const dishesData = menuRes.data.menu.dishes || [];
          setDishes(dishesData);

          const uniqueCategories = Array.from(
            new Set(dishesData.map((dish) => dish.category).filter(Boolean))
          );
          setDynamicCategories(uniqueCategories);
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
    const interval = setInterval(() => fetchData(), 10000);
    return () => clearInterval(interval);
  }, [restaurantId]);

  const fullCategoryList = ["Tous", ...dynamicCategories];
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
    return <div className="p-4 text-center text-red-500 text-sm">{error}</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        {currentRestaurant?.logo && (
          <img
            src={currentRestaurant.logo}
            alt="Logo du restaurant"
            className="h-12 w-12 object-cover rounded-full"
            onError={(e) => {
              e.target.src = "/images/default-logo.jpg";
            }}
          />
        )}

        <h3 className="text-2xl font-bold text-center">
          Bienvenue au restaurant {currentRestaurant?.name || "Restaurant"}
        </h3>

        <img
          src={`${apiUrl}/assets/logo.png`}
          alt="Logo du projet"
          className="h-12 w-12 object-cover rounded-full"
          onError={(e) => {
            e.target.src = "/images/default-project-logo.jpg";
          }}
        />
      </div>

      {/* 🔘 Catégories */}
      <div className="flex flex-wrap gap-2 mb-6">
        {fullCategoryList.map((category) => (
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

      {/* 🍽 Liste des plats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredDishes.length > 0 ? (
          filteredDishes.map((dish) => (
            <div
              key={dish._id}
              className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden cursor-pointer"
              onClick={() => navigate(`/restaurant/${restaurantId}/dish/${dish._id}`)}
            >
              <div className="relative pt-[75%] overflow-hidden">
                {dish.image ? (
                  <img
                    src={dish.image.startsWith("http") ? dish.image : `${apiUrl}${dish.image}`}
                    alt={dish.title}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x225?text=Image+Manquante";
                      e.target.className =
                        "absolute top-0 left-0 w-full h-full object-contain p-4 bg-gray-100";
                    }}
                  />
                ) : (
                  <div className="absolute top-0 left-0 w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Pas d'image</span>
                  </div>
                )}
              </div>

              <div className="p-3 space-y-1">
                <h3 className="text-base font-semibold truncate">{dish.title || "Sans titre"}</h3>
                {dish.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">{dish.description}</p>
                )}
                <p className="text-yellow-600 text-sm font-bold">{dish.price} Fcfa</p>
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

      {/* 📢 Publicités depuis localhost */}
      {publicites.length > 0 && (
  <div className="my-8">
    <h3 className="text-lg font-bold mb-4 text-center">Publicités</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {publicites.map((pub) => (
        <div key={pub._id} className="bg-white shadow rounded-lg overflow-hidden">
          <img
            src={pub.imageUrl}
            alt={pub.titre}
            className="w-full h-40 object-cover"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x150?text=Image+non+trouvée";
            }}
          />
          <div className="p-4">
            <h4 className="font-semibold">{pub.titre}</h4>
            <p className="text-sm text-gray-600">{pub.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
)}


      <div className="mt-8 border-t pt-4 text-center text-xs text-gray-400">
        <p>OUTAM</p>
        <p>Votre publicité avec</p>
        <p className="font-semibold">outam</p>
      </div>
    </div>
  );
};

export default DesktopDailyMenu;
