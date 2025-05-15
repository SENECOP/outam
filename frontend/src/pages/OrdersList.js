import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { Home, List, ShoppingCart, BarChart, User, LogOut, Menu } from "lucide-react";


const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [dishCounts, setDishCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const { restaurantId } = useParams();
  const apiUrl = process.env.REACT_APP_API_URL;

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/restaurant/${restaurantId}/commandes`);
        setOrders(res.data);
      } catch (err) {
        console.error("Erreur de chargement des commandes :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [restaurantId]);

  // Fetch dish counts
  useEffect(() => {
    const fetchDishCounts = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/restaurant/${restaurantId}/commandes/dish-counts`);
        setDishCounts(res.data);
      } catch (err) {
        console.error("Erreur de chargement des statistiques :", err);
      }
    };

    fetchDishCounts();
  }, [restaurantId]);

  // Fonction pour déterminer la couleur du statut
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

  // Mettre à jour le statut de la commande
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`${apiUrl}/api/restaurant/${restaurantId}/commandes/${orderId}/status`, {
        status: newStatus,
      });

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

  // Filtrer les commandes en fonction du statut
  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  // Récupérer le nombre de fois que le plat a été commandé
  const getDishCount = (dish) => {
    if (!dish || !dish._id) return 0;
    const found = dishCounts.find(
      (item) => item.dishId?.toString() === dish._id?.toString()
    );
    return found ? found.count : 0;
  };

  // Fonction pour déterminer si c'est la première occurrence d'un plat
  const isFirstOccurrence = (order, index) => {
    if (!order.dish) return true;
    
    // Trouver l'index de la première commande avec ce plat
    const firstIndex = filteredOrders.findIndex(
      (o) => o.dish?._id?.toString() === order.dish?._id?.toString()
    );
    
    return firstIndex === index;
  };

  return (
    <DashboardLayout>
      <div className="flex h-screen bg-gray-100">
        <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto p-4 ml-1">
        {/* Filtres */}
        <div className="flex items-center mb-6">
              <div className="bg-yellow-500 p-3 rounded-full mr-4 shadow-md">
    <ShoppingCart size={20} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">
               Liste des commandes
              </h1>
            </div>

        <nav className="bg-white shadow-sm rounded-lg mb-6 p-4 flex space-x-4">
          {["all", "Commandes livrées"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-2 rounded-lg font-medium ${
                filterStatus === status
                  ? "bg-blue-500 text-white"
                  : "bg-blue-50 text-blue-600"
              }`}
            >
              {status === "all" ? "Liste commandes" : status}
            </button>
          ))}
        </nav>

        {/* Table */}
        <div className="p-4 w-full bg-white shadow rounded">
          <h1 className="text-2xl font-bold mb-4">Commandes reçues</h1>

          {loading ? (
            <p>Chargement des commandes...</p>
          ) : filteredOrders.length === 0 ? (
            <p>Aucune commande trouvée pour ce statut.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="p-3">Nom de la commande</th>
                  <th className="p-3">Montant</th>
                  <th className="p-3">Numero Table</th>
                  {/* <th className="p-3">Action</th> */}
                </tr>
              </thead>
              <tbody>
                {/* Affichage des commandes filtrées */}
                {filteredOrders.map((order, index) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        {/* Afficher le nombre de commandes du plat uniquement pour la première occurrence */}
                        {order.dish && isFirstOccurrence(order, index) && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                            {getDishCount(order.dish)}×
                          </span>
                        )}
                        <div>
                          <p className="font-semibold">
                            Commande #{order._id.slice(-6)}
                          </p>
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
                      <span
                        className={`text-white px-3 py-1 rounded-full text-sm ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status || "en attente"}
                      </span>
                    </td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
      </div>
      </div>
    </DashboardLayout>
  );
};

export default OrdersList;