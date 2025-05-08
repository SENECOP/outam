import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";import DashboardLayout from "../components/DashboardLayout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Analyses() {
  const jours = ['S', 'D', 'L', 'M', 'M', 'J', 'V'];
  const scanData = [30, 25, 55, 35, 45, 50, 20];
  const commandesData = [28, 35, 55, 48, 43, 57, 29];
  const moyenneItems = [5, 3, 3, 4, 4, 8, 3];
  
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

  const renderBarChart = (data) => {
    const maxY = 60;
    const yTicks = [60, 50, 40, 30, 20, 10, 0];

    return (
      <div className="flex">
        {/* Axe Y */}
        <div className="flex flex-col justify-between h-40 mr-2">
          {yTicks.map((val, i) => (
            <span key={i} className="text-xs text-gray-500" style={{ height: 'calc(100% / 7)' }}>
              {val}
            </span>
          ))}
        </div>

        {/* Barres */}
        <div className="flex items-end justify-between h-40 px-2 w-full">
          {data.map((val, i) => (
            <div key={i} className="flex flex-col items-center">
              <div
                className="w-6 bg-blue-500 rounded"
                style={{ height: `${(val / maxY) * 160}px` }}
              ></div>
              <span className="text-xs mt-1">{jours[i]}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  const renderLineChart = (data, label) => {
    const chartData = data.map((val, i) => ({
      name: jours[i],
      value: val,
    }));
  
    return (
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis width={30} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };


  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 bg-white">
        <h2 className="text-lg font-semibold">Dans cet espace, vous pouvez voir vos states</h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
          {/* Cartes stats */}
          <div className="grid grid-cols-2 gap-4 md:col-span-3">
            <div className="bg-white shadow p-4 rounded space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">commandes</span>
                <select className="text-xs border border-gray-300 rounded px-2 py-1 bg-green-500">
  <option className="bg-green-500 text-white">Jour</option>
  <option className="bg-green-500 text-white">Semaine</option>
  <option className="bg-green-500 text-white">Mois</option>
  <option className="bg-green-500 text-white">Année</option>
</select>

              </div>
              <div className="text-xl font-bold">500</div>
            </div>

            <div className="bg-white shadow p-4 rounded space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Moyenne par jour</span>
                <select className="text-xs border border-gray-300 rounded px-2 py-1 bg-green-500">
                  <option>Jour</option>
                </select>
              </div>
              <div className="text-xl font-bold">12</div>
            </div>

            <div className="bg-white shadow p-4 rounded space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Revenus Aujourd'hui</span>
                {/* <select className="text-xs border border-gray-300 rounded px-2 py-1 bg-green-500">
                  <option>Jour</option>
                </select> */}
              </div>
              <div className="text-xl font-bold">75 000 <span className="text-sm">FCFA</span></div>
            </div>

            <div className="bg-white shadow p-4 rounded space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Revenus total</span>
                <select className="text-xs border border-gray-300 rounded px-2 py-1 bg-green-500">
                  <option>Jour</option>
                </select>
              </div>
              <div className="text-xl font-bold">125 500 <span className="text-sm">FCFA</span></div>
            </div>
          </div>

          {/* Histogramme avec axe Y */}
          <div className="bg-white shadow p-4 rounded h-full space-y-2 md:col-span-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Nombre de scan</span>
              <select className="text-xs border border-gray-300 rounded px-2 py-1 bg-green-500">
                <option>Jour</option>
              </select>
            </div>
            {renderBarChart(scanData)}
          </div>
        </div>

        {/* Graphiques lignes */}
        <div className="grid md:grid-cols-2 gap-4">
  <div className="bg-white shadow p-4 rounded">
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm font-medium">Nombre de commande</span>
      <select className="text-xs border border-gray-300 rounded px-2 py-1 bg-green-500">
        <option>Jour</option>
      </select>
    </div>
    {renderLineChart(commandesData, "Nombre de commande")}
  </div>

  <div className="bg-white shadow p-4 rounded">
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm font-medium">Moyenne item par commande</span>
      <select className="text-xs border border-gray-300 rounded px-2 py-1 bg-green-500">
        <option>Jour</option>
      </select>
    </div>
    {renderLineChart(moyenneItems, "Moyenne")}
  </div>
</div>
<div className="grid md:grid-cols-5 gap-8"> {/* Augmenter l'espace avec gap-6 */}
  {/* Card Nombre de commande (colonne 1, pas d'étendue) */}
  <div className="bg-white shadow p-2 rounded">
    <div className="p-4 flex items-start">
    <img
  src="/assets/t.jpeg"  // Chemin de l'image statique
  alt="Description de l'image"
  className="w-16 h-16 rounded-md object-cover mr-4"
  onError={(e) => {
    e.target.src = 'https://via.placeholder.com/64';
    e.target.onerror = null;
  }}
/>

                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h1 className="font-semibold text-gray-800">
                                    <p>Dejeuner </p>
                                    <span className="text-blue-600 ml-2">
                                      {/* {item.price ? `${item.price} FCFA` : 'Prix non disponible'} */}
                                    </span>
                                  </h1>
                                  <p className="text-green-500">
                                    {/* {item.category || 'Catégorie non définie'} */}
                                  </p>
    
                                 
                                </div>
                                
                              </div>
    
                             
                            </div>
                          </div>
  </div>

  {/* Card étendue sur 3 colonnes (col-span-3) */}
  <div className="bg-white shadow p-4 gap-8 rounded md:col-span-3 flex flex-col justify-between">
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm font-medium">Moyenne item par commande</span>
      <select className="text-xs border border-gray-300 rounded px-2 py-1 bg-green-500">
        <option>Jour</option>
      </select>
    </div>
    {renderLineChart(moyenneItems, "Moyenne")}
  </div>
</div>
<div className="p-4 w-full bg-white shadow rounded">
          <h1 className="text-2xl font-bold mb-4">Hisorique des commandes</h1>

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
                        <span className="bg-pink-500 text-white p-2 rounded-full">
                          🍽️
                        </span>
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





      </div>
    </DashboardLayout>
  );
}
