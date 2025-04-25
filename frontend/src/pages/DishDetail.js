import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ChevronLeft, Plus, ShoppingBag } from "lucide-react";

const DishDetail = () => {
  const navigate = useNavigate();
  const { id: restaurantId, dishId } = useParams();
  const apiUrl = process.env.REACT_APP_API_URL;

  const [dish, setDish] = useState(null);
  const [extras, setExtras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDish = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(
          `${apiUrl}/api/restaurant/${restaurantId}/dish/${dishId}`
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
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  if (!dish) return null;

  return (
    <div className="relative max-w-md mx-auto bg-white min-h-screen rounded-t-3xl overflow-hidden shadow-lg">
      {/* Image du plat */}
      <div className="relative">
        <img
          src={
            dish.image?.startsWith("http")
              ? dish.image
              : `${apiUrl}${dish.image}`
          }
          alt={dish.title}
          className="w-full h-80 object-cover rounded-b-3xl"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x200?text=Image";
          }}
        />

        {/* Bouton retour */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white rounded-full p-2 shadow hover:scale-105 transition"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Panier */}
        <button className="absolute top-4 right-4 bg-white rounded-full p-2 shadow hover:scale-105 transition">
          <ShoppingBag size={20} />
        </button>
      </div>

      {/* Contenu */}
      <div className="bg-white rounded-t-3xl -mt-1 p-6">
      <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-gray-800">{dish.title}</h2>
          <button className="bg-yellow-400 text-white rounded-full p-2 shadow hover:scale-105 transition">
            <Plus size={18} />
          </button>
        </div>

        <p className="text-lg text-yellow-600 font-semibold mb-4">{dish.price} Fcfa</p>

        <p className="text-sm text-gray-600 leading-relaxed">{dish.description}</p>

        {/* Extras */}
        {dish.extras && dish.extras.length > 0 && (
          <div className="mt-6">
            <h3 className="text-md font-semibold text-gray-700 mb-2">Extras disponibles</h3>
            <div className="flex flex-wrap gap-2">
              {dish.extras.map((extra, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectExtra(extra)}
                  className={`px-3 py-1 text-sm rounded-full border transition ${
                    extras.includes(extra)
                      ? "bg-yellow-500 text-white border-yellow-500"
                      : "bg-gray-100 text-gray-700 border-gray-300"
                  }`}
                >
                  {extra}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bouton commander */}
        <button className="mt-8 w-full bg-yellow-500 hover:bg-yellow-600 transition text-white font-bold py-3 rounded-xl shadow-md">
          Commander
        </button>
      </div>
    </div>
  );
};

export default DishDetail;
