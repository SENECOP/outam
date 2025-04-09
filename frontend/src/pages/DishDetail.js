import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ChevronLeft, Plus, ShoppingBag, ChevronRight } from "lucide-react";

const DishDetail = () => {
  const navigate = useNavigate();
  const { id: restaurantId, dishId } = useParams();

  const [dish, setDish] = useState(null);
  const [extras, setExtras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(4); // Exemple 4/9

  useEffect(() => {
    const fetchDish = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(
          `http://localhost:5000/api/restaurant/${restaurantId}/dish/${dishId}`
        );

        setDish(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Erreur lors du chargement du plat.");
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId && dishId) {
      fetchDish();
    }
  }, [restaurantId, dishId]);

  const handleSelectExtra = (extra) => {
    setExtras((prev) =>
      prev.includes(extra) ? prev.filter((e) => e !== extra) : [...prev, extra]
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">{error}</div>
    );
  }

  if (!dish) return null;

  return (
    <div className="relative max-w-md mx-auto bg-white min-h-screen rounded-t-3xl overflow-hidden">
      {/* Image du plat */}
      <div className="relative">
        <img
          src={
            dish.image?.startsWith("http")
              ? dish.image
              : `http://localhost:5000${dish.image}`
          }
          alt={dish.title}
          className="w-full h-56 object-cover"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x200?text=Image";
          }}
        />

        {/* Bouton retour */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-3 left-3 bg-white rounded-full p-1"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Panier */}
        <button className="absolute top-3 right-3 bg-white rounded-full p-1">
          <ShoppingBag size={22} />
        </button>
      </div>

      {/* Contenu */}
      <div className="bg-white rounded-t-3xl -mt-6 p-5">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{dish.title}</h2>
          <button className="bg-yellow-400 text-white rounded-full p-2">
            <Plus size={18} />
          </button>
        </div>

        <p className="text-md font-bold mt-1">{dish.price} Fcfa</p>

        <p className="text-sm text-gray-600 mt-2">{dish.description}</p>

        {/* Extras */}
        {dish.extras && dish.extras.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium text-sm mb-2">Ajouter des extras</h3>
            <div className="flex flex-wrap gap-2">
              {dish.extras.map((extra, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectExtra(extra)}
                  className={`px-3 py-1 text-sm rounded ${
                    extras.includes(extra)
                      ? "bg-yellow-400 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {extra}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Slider pagination (si besoin plus tard) */}
        

        {/* Bouton commander */}
        <button className="w-full bg-yellow-400 text-white font-semibold text-lg py-3 rounded-xl mt-6">
          Commander
        </button>
      </div>
    </div>
  );
};

export default DishDetail;
