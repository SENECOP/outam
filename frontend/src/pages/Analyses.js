import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar
} from "recharts";
import { BarChart as BarChartIcon, Home, List, ShoppingCart, User, LogOut, Menu } from "lucide-react";

export default function Analyses() {
  const jours = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
  const heures = Array.from({length: 24}, (_, i) => i);
  const [scanData, setScanData] = useState([30, 25, 55, 35, 45, 50, 20]);
  const [commandesData, setCommandesData] = useState([28, 35, 55, 48, 43, 57, 29]);
  const [moyenneItems, setMoyenneItems] = useState([5, 3, 3, 4, 4, 8, 3]);
  const [topPlats, setTopPlats] = useState([]);
  const [picCommandes, setPicCommandes] = useState([]);
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [timeFilter, setTimeFilter] = useState("jour");
  const { restaurantId } = useParams();
  const apiUrl = process.env.REACT_APP_API_URL;

  // Données factices pour la démo
  useEffect(() => {
    // Simuler des données pour les plats les plus commandés
    setTopPlats([
      { name: "Poulet Braisé", count: 45 },
      { name: "Poisson Grillée", count: 38 },
      { name: "Riz Sauce", count: 32 },
      { name: "Attiéké Poisson", count: 28 },
      { name: "Alloco", count: 25 }
    ]);

    // Simuler des données pour les pics de commande
    setPicCommandes(heures.map(h => ({
      heure: `${h}h`,
      commandes: h === 12 ? 35 : h === 19 ? 42 : Math.floor(Math.random() * 20) + 5
    })));
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${apiUrl}/api/restaurant/${restaurantId}/commandes`
        );
        setOrders(res.data);
        
        // Calculer les indicateurs à partir des commandes
        calculateIndicators(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const calculateIndicators = (orders) => {
      // Ici vous devriez implémenter la logique pour calculer les vrais indicateurs
      // à partir des données des commandes en fonction du filtre de temps
      // Pour l'exemple, nous utilisons des données factices
    };

    fetchOrders();
  }, [restaurantId, timeFilter]);

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

  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  const renderBarChart = (data) => {
    return (
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderLineChart = (data, label) => {
    const chartData = data.map((val, i) => ({
      name: jours[i],
      value: val,
    }));
  
    return (
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
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

  const renderPicCommandesChart = () => {
    return (
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={picCommandes}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="heure" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="commandes" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const TimeFilterSelect = ({ value, onChange }) => (
    <select 
      value={value} 
      onChange={onChange}
      className="text-xs border border-gray-300 rounded px-2 py-1 bg-green-500 text-white"
    >
      <option value="jour">Jour</option>
      <option value="semaine">Semaine</option>
      <option value="mois">Mois</option>
    </select>
  );

  return (
    <DashboardLayout>
      <div className="flex h-screen bg-gray-100">
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 ml-1">
            <div className="flex items-center mb-6">
              <div className="bg-purple-500 p-3 rounded-full mr-4 shadow-md">
                <BarChartIcon size={20} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">
                Analyse des données
              </h1>
            </div>

            <div className="p-4 w-full bg-white shadow rounded">
              <h2 className="text-lg font-semibold mb-4">Indicateurs clés</h2>

              {/* Filtre temporel global */}
              <div className="mb-4 flex justify-end">
                <TimeFilterSelect 
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                />
              </div>

              {/* Cartes stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <StatCard 
                  title="Commandes totales" 
                  value="500" 
                  filter={<TimeFilterSelect value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} />}
                />
                <StatCard 
                  title="Commandes du jour" 
                  value="24" 
                />
                <StatCard 
                  title="Revenu total" 
                  value="125 500 FCFA" 
                  filter={<TimeFilterSelect value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} />}
                />
                <StatCard 
                  title="Revenu du jour" 
                  value="75 000 FCFA" 
                />
              </div>

              {/* Graphiques principaux */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <ChartCard 
                  title="Nombre de scans QR Code"
                  chart={renderBarChart(topPlats)}
                  filter={<TimeFilterSelect value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} />}
                />
                <ChartCard 
                  title="Plats les plus commandés"
                  chart={renderBarChart(topPlats)}
                  filter={<TimeFilterSelect value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} />}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <ChartCard 
                  title="Nombre de commandes"
                  chart={renderLineChart(commandesData)}
                  filter={<TimeFilterSelect value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} />}
                />
                <ChartCard 
                  title="Moyenne items par commande"
                  chart={renderLineChart(moyenneItems)}
                  filter={<TimeFilterSelect value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} />}
                />
              </div>

              <div className="mb-6">
                <ChartCard 
                  title="Pic de commandes par heure"
                  chart={renderPicCommandesChart()}
                  filter={<TimeFilterSelect value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} />}
                />
              </div>

              {/* Historique des commandes */}
              <div className="p-4 bg-white shadow rounded">
                <h1 className="text-xl font-bold mb-4">Historique des commandes</h1>
                {loading ? (
                  <p>Chargement des commandes...</p>
                ) : filteredOrders.length === 0 ? (
                  <p>Aucune commande trouvée pour ce statut.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="p-3">Commande</th>
                          <th className="p-3">Montant</th>
                          <th className="p-3">Statut</th>
                          <th className="p-3">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((order) => (
                          <tr key={order._id} className="border-b hover:bg-gray-50">
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
                                <span className={`text-white px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                                  {order.status || "en attente"}
                                </span>
                              </div>
                            </td>
                            <td className="p-3">
                              <select
                                value={order.status || ""}
                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                className="text-sm px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 transition"
                              >
                                <option value="" disabled>Changer statut</option>
                                <option value="en attente">En attente</option>
                                <option value="en cuisine">En cuisine</option>
                                <option value="Prête">Prête</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Composants réutilisables

const StatCard = ({ title, value, filter }) => (
  <div className="bg-white shadow p-4 rounded space-y-2">
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-600">{title}</span>
      {filter}
    </div>
    <div className="text-xl font-bold">{value}</div>
  </div>
);

const ChartCard = ({ title, chart, filter }) => (
  <div className="bg-white shadow p-4 rounded space-y-4">
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium">{title}</span>
      {filter}
    </div>
    <div className="h-64">
      {chart}
    </div>
  </div>
);