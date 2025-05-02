import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const navigate = useNavigate();

  // Charger le panier depuis localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  // Mise à jour de la quantité d'un article (version corrigée)
  const updateQuantity = (index, delta) => {
    setCart(prevCart => {
      const updatedCart = prevCart
        .map((item, i) => {
          if (i === index) {
            const newQuantity = item.quantity + delta;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter(Boolean);
      
      // Calcul immédiat du nouveau total et count
      const newTotal = updatedCart.reduce((sum, item) => sum + (item.quantity * (item.dish?.price || 0)), 0);
      const newCount = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
      
      // Mise à jour synchronisée des états
      setTotal(newTotal);
      setItemCount(newCount);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      
      return updatedCart;
    });
  };

  // Calcul initial au chargement
  useEffect(() => {
    const newTotal = cart.reduce((sum, item) => sum + (item.quantity * (item.dish?.price || 0)), 0);
    const newCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotal(newTotal);
    setItemCount(newCount);
  }, [cart]);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white p-4 rounded-t-3xl shadow">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-gray-100 rounded-full">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-semibold">Mon Panier</h2>
      </div>

      {cart.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">Votre panier est vide.</p>
      ) : (
        cart.map((item, index) => {
          const dish = item?.dish || {};
          const quantity = item?.quantity || 0;
          const price = dish?.price || 0;
          const imageSrc = dish.image?.startsWith("http")
            ? dish.image
            : `${process.env.REACT_APP_API_URL}${dish.image}`;

          return (
            <div
              key={dish._id || `${dish.title}-${index}`}
              className="flex items-center gap-4 mb-4 bg-gray-50 p-2 rounded-lg"
            >
              <img
                src={imageSrc || "https://via.placeholder.com/64"}
                alt={dish.title || "Plat"}
                className="w-16 h-16 object-cover rounded-md"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/64";
                }}
              />
              <div className="flex-1">
                <h3 className="text-sm font-semibold">{dish.title || "Titre manquant"}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {dish.description || "Description manquante"}
                </p>
                <p className="text-sm font-bold text-yellow-600">{price} Fcfa</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => updateQuantity(index, -1)}
                  className="bg-gray-300 text-white px-2 rounded-full"
                >
                  -
                </button>
                <span className="px-2">{quantity}</span>
                <button
                  onClick={() => updateQuantity(index, 1)}
                  className="bg-gray-300 text-white px-2 rounded-full"
                >
                  +
                </button>
              </div>
            </div>
          );
        })
      )}

      {cart.length > 0 && (
        <div className="mt-6 p-4 bg-white rounded-xl shadow border">
          <h3 className="font-bold text-gray-800">TOTAL</h3>
          <p className="text-sm text-gray-500">
            {itemCount} article{itemCount > 1 ? "s" : ""} sélectionné{itemCount > 1 ? "s" : ""}
          </p>
          <div className="text-sm mt-2">
            {cart.map((item, i) => {
              const dish = item?.dish || {};
              const quantity = item?.quantity || 0;
              const price = dish?.price || 0;
              return (
                <div key={dish._id || i} className="flex justify-between text-gray-600">
                  <span>{quantity} x {price} Fcfa</span>
                  <span>{quantity * price} Fcfa</span>
                </div>
              );
            })}
          </div>
          <div className="border-t mt-2 pt-2 flex justify-between font-bold">
            <span>Total</span>
            <span>{total} Fcfa</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;