import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ChevronLeft, Plus, ShoppingBag } from "lucide-react";

const DishDetail = () => {
  const navigate = useNavigate();
  const { id: restaurantId, dishId } = useParams();
  const apiUrl = process.env.REACT_APP_API_URL;

  const [extrasSelected, setExtrasSelected] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [dish, setDish] = useState(null);
  const [extras, setExtras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const syncCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const total = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(total);
    };

    syncCartCount();
    window.addEventListener("storage", syncCartCount);
    return () => {
      window.removeEventListener("storage", syncCartCount);
    };
  }, []);

  useEffect(() => {
    const fetchExtras = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/extras/showextras`);
        setExtras(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement des extras :", err);
      }
    };

    fetchExtras();
  }, [apiUrl]); // ✅ correction ici

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
  }, [apiUrl, restaurantId, dishId]); // ✅ correction ici

  const handleSelectExtra = (extra) => {
    setExtrasSelected((prev) => {
      const exists = prev.find((e) => e._id === extra._id);
      return exists
        ? prev.filter((e) => e._id !== extra._id)
        : [...prev, extra];
    });
  };

  const addToCart = () => {
    if (!dish || !dish._id) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingIndex = cart.findIndex(item => item.dish && item.dish._id === dish._id);

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        dish,
        extras: extrasSelected,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
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
  const sendOrder = async () => {
    if (!dish || !restaurantId) {
      alert("Les informations du plat ou du restaurant sont manquantes.");
      return;
    }
  
    try {
      const dishId = dish._id;
      const extrasIds = extrasSelected.map((extra) => extra._id);
      const extrasTotal = extrasSelected.reduce((sum, extra) => sum + extra.price, 0);
      const total = dish.price + extrasTotal;
  
      await axios.post(`${apiUrl}/api/restaurant/${restaurantId}/commandes`, {
        dishId,
        extrasIds,
        total,
      });
  
      alert("Commande envoyée avec succès !");
      navigate(`/menu/${restaurantId}`); // ✅ redirection vers DesktopDailyMenu
    } catch (error) {
      console.error("Erreur lors de l'envoi de la commande :", error);
      alert("Une erreur est survenue lors de l'envoi de la commande.");
    }
  };
  
  

  return (
    <div className="relative max-w-md mx-auto bg-white min-h-screen rounded-t-3xl overflow-hidden shadow-lg">
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

        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white rounded-full p-2 shadow hover:scale-105 transition"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          onClick={() => navigate("/cart")}
          className="absolute top-4 right-4 bg-white rounded-full p-2 shadow hover:scale-105 transition"
        >
          <ShoppingBag size={20} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      <div className="bg-white rounded-t-3xl -mt-1 p-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-gray-800">{dish.title}</h2>
          <button
            onClick={addToCart}
            className="bg-yellow-400 text-white rounded-full p-2 shadow hover:scale-105 transition"
          >
            <Plus size={18} />
          </button>
        </div>

        <p className="text-lg text-yellow-600 font-semibold mb-4">{dish.price} Fcfa</p>
        <p className="text-sm text-gray-600 leading-relaxed">{dish.description}</p>

        {extras.length > 0 && (
          <div className="mt-6">
            <h3 className="text-md font-semibold text-gray-700 mb-2">Extras disponibles</h3>
            <div className="flex flex-wrap gap-2">
              {extras.map((extra, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectExtra(extra)}
                  className={`px-3 py-1 text-sm border transition ${
                    extrasSelected.find((e) => e._id === extra._id)
                      ? "bg-yellow-500 text-white border-yellow-500"
                      : "bg-gray-100 text-gray-700 border-gray-300"
                  }`}
                >
                  {extra.name}
                </button>
              ))}
            </div>
          </div>
        )}

<button
  className="mt-8 w-full bg-yellow-500 hover:bg-yellow-600 transition text-white font-bold py-3 rounded-xl shadow-md"
  onClick={sendOrder}
>
  Commander
</button>

      </div>
    </div>
  );
};

export default DishDetail;
