import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ChevronLeft, Plus, ShoppingBag } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
  }, [apiUrl, restaurantId, dishId]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    adaptiveHeight: true,
  };

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

  // Envoie l'utilisateur vers la page OrderSummary avec les détails de la commande
  const handleOrder = () => {
    if (!dish || !restaurantId) {
      alert("Erreur: Plat ou restaurant manquant");
      return;
    }

    const extrasTotal = extrasSelected.reduce((sum, extra) => sum + extra.price, 0);
    const total = dish.price + extrasTotal;

    navigate("/order-summary", {
      state: {
        dish,
        extrasSelected,
        restaurantId,
        total
      }
    });
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
      <div className="relative">
        {/* Affichage d'images avec slider si plusieurs images */}
        {Array.isArray(dish.image) && dish.image.length > 1 ? (
          <Slider {...sliderSettings}>
            {dish.image.map((img, index) => (
              <div key={index}>
                <img
                  src={typeof img === "string" && img.startsWith("http") ? img : `${apiUrl}${img}`}
                  alt={`${dish.title} ${index + 1}`}
                  className="w-full h-80 object-cover rounded-b-3xl"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x200?text=Image";
                  }}
                />
              </div>
            ))}
          </Slider>
        ) : (
          <img
            src={
              dish.image && typeof dish.image === "string" && dish.image.startsWith("http")
                ? dish.image
                : `${apiUrl}${dish.image}`
            }
            alt={dish.title}
            className="w-full h-80 object-cover rounded-b-3xl"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x200?text=Image";
            }}
          />
        )}

        {/* Navigation */}
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

        {/* Extras */}
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
          onClick={handleOrder}
        >
          Commander
        </button>
      </div>
    </div>
  );
};

export default DishDetail;
