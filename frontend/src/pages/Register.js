import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all"); // ✅ filtre local
  const { restaurantId } = useParams();
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${apiUrl}/api/restaurant/${restaurantId}/commandes`
        );
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [restaurantId]);

  const getStatusColor = (status) => {
    switch (status) {
      case "en cuisine":
        return "bg-pink-500";
      case "en attente":
        return "bg-orange-400";
      case "Prête":
        return "bg-green-600";
      default:
        return "bg-gray-300";
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${apiUrl}/api/restaurant/${restaurantId}/commandes/${orderId}/status`,
        { status: newStatus }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Erreur mise à jour statut :", error);
      alert("Erreur lors de la mise à jour du statut.");
    }
  };

  // ✅ Applique le filtre
  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((order) => order.status === filterStatus);
const [dishCounts, setDishCounts] = useState([]);

useEffect(() => {
  const fetchDishCounts = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/restaurant/${restaurantId}/commandes/dish-counts`);
      setDishCounts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchDishCounts();
}, [restaurantId]);
const getDishCount = (dish) => {
  if (!dish || !dish._id) return 0;
  const found = dishCounts.find((item) => 
    item.dishId && item.dishId.toString() === dish._id.toString()
  );
  return found ? found.count : 0;
};;

  return (
    <DashboardLayout>
      <main className="flex-1 overflow-y-auto p-4">
        {/* Navigation filtres en haut */}
        <nav className="bg-white shadow-sm rounded-lg mb-6 p-4 flex space-x-4">
          {["all", "en attente", "en cuisine", "Prête"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-2 rounded-lg font-medium ${
                filterStatus === status
                  ? "bg-blue-500 text-white"
                  : "bg-blue-50 text-blue-600"
              }`}
            >
              {status === "all" ? "Gestion des commandes" : status}
            </button>
          ))}
        </nav>

        {/* Contenu principal */}
        <div className="p-4 w-full bg-white shadow rounded">
          <h1 className="text-2xl font-bold mb-4">Commandes reçues</h1>

          {loading ? (
            <p>Chargement des commandes...</p>
          ) : filteredOrders.length === 0 ? (
            <p>Aucune commande trouvée pour ce statut.</p>
          ) : (
            <table className="w-full bg-white shadow rounded">
              <thead>
                <tr className="text-left border-b">
                  <th className="p-3">Nom de la commande</th>
                  <th className="p-3">Montant</th>
                  <th className="p-3">Statut</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-pink-500 text-white text-sm font-bold">
                    {getDishCount(order.dish)}
                  </span>
                    <span className="bg-pink-500 text-white p-2 rounded-full">
                      🍽️
                    </span>
                    <div>
                      <p className="font-semibold">Commande #{order._id.slice(-6)}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.date).toLocaleString()}
                      </p>
                    </div>
                  </div>

                    </td>
                    <td className="p-3">
                      {(order.total || 0).toLocaleString()} FCFA
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-white px-3 py-1 rounded-full text-sm ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status || "en attente"}
                        </span>
                        <p className="text-xs text-gray-500">Payé</p>
                      </div>
                    </td>
                    <td className="p-3 flex items-center gap-2">
                      <select
                        value={order.status || ""}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className="text-sm px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 transition"
                      >
                        <option value="" disabled>
                          Changer le statut
                        </option>
                        <option value="en attente" className="text-black">
                          En attente
                        </option>
                        <option value="en cuisine" className="text-black">
                          En cuisine
                        </option>
                        <option value="Prête" className="text-black">
                          Prête
                        </option>
                      </select>

                      <button className="w-8 h-8 flex items-center justify-center rounded bg-gray-400 hover:bg-gray-500 transition">
                        <span className="text-white text-lg">⋮</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </DashboardLayout>
  );
};

export default OrdersList;
