import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

const OrderSummary = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  // Récupère les données passées lors de la navigation
  const { dish, extrasSelected, restaurantId } = state || {};

  useEffect(() => {
    if (!dish || !restaurantId) {
      // Redirige si aucune donnée
      navigate(-1);
    }
  }, [dish, restaurantId, navigate]);

  if (!dish || !restaurantId) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center text-red-500">
          Aucune commande reçue. <br />
          <button className="underline text-blue-600" onClick={() => navigate(-1)}>
            Retour
          </button>
        </div>
      </div>
    );
  }

  const extrasTotal = extrasSelected.reduce((sum, extra) => sum + extra.price, 0);
  const total = dish.price + extrasTotal;

  const handleConfirm = async () => {
    try {
      const dishId = dish._id;
      const extrasIds = extrasSelected.map((extra) => extra._id);

      const res = await axios.post(`${apiUrl}/api/restaurant/${restaurantId}/commandes`, {
        dishId,
        extrasIds,
        total,
      });

      alert("Commande envoyée avec succès !");
      navigate("/");
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi :", error);
      alert("Erreur lors de l'envoi de la commande.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-12 p-8 bg-white shadow-xl rounded-xl border-t-4 border-yellow-500">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Récapitulatif de la commande</h2>

      <div className="flex flex-col gap-4 mb-8">
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold text-gray-700">Plat :</p>
          <p className="text-lg text-gray-900">{dish.title}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold text-gray-700">Description :</p>
          <p className="text-sm text-gray-600">{dish.description}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold text-gray-700">Prix de base :</p>
          <p className="text-lg text-gray-900">{dish.price} Fcfa</p>
        </div>
      </div>

      {extrasSelected.length > 0 && (
        <div className="mt-6">
          <p className="text-xl font-semibold text-gray-800">Extras sélectionnés :</p>
          <ul className="list-disc pl-6 text-sm text-gray-700 mt-3">
            {extrasSelected.map((extra, idx) => (
              <li key={idx}>
                <span className="font-medium">{extra.name}</span> (+{extra.price} Fcfa)
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="my-6 border-t-2 border-gray-200"></div>

      <div className="flex justify-between items-center text-lg font-bold text-gray-800">
        <p>Total :</p>
        <p>{total} Fcfa</p>
      </div>

      <button
        onClick={handleConfirm}
        className="mt-8 w-full py-3 bg-yellow-600 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-700 transition duration-300"
      >
        Confirmer la commande
      </button>
    </div>
  );
};

export default OrderSummary;
