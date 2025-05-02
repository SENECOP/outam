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
      <div className="text-center mt-10 text-red-500">
        Aucune commande reçue. <br />
        <button className="underline text-blue-600" onClick={() => navigate(-1)}>
          Retour
        </button>
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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Récapitulatif de la commande</h2>

      <p className="mb-2"><strong>Plat :</strong> {dish.title}</p>
      <p className="mb-2"><strong>Description :</strong> {dish.description}</p>
      <p className="mb-2"><strong>Prix de base :</strong> {dish.price} Fcfa</p>

      {extrasSelected.length > 0 && (
        <>
          <p className="mt-4 font-semibold">Extras sélectionnés :</p>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {extrasSelected.map((extra, idx) => (
              <li key={idx}>{extra.name} (+{extra.price} Fcfa)</li>
            ))}
          </ul>
        </>
      )}

      <hr className="my-4" />

      <p className="text-lg font-bold">Total : {total} Fcfa</p>

      <button
        className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded"
        onClick={handleConfirm}
      >
        Confirmer la commande
      </button>
    </div>
  );
};

export default OrderSummary;
