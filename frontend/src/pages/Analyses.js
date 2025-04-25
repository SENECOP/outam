import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { MoreVertical } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";

const stats = [
  { label: "Total commandes", value: 500 },
  { label: "Commandés aujourd’hui", value: 32 },
  { label: "Moyenne par jour", value: 12 },
  { label: "Revenus Aujourd’hui", value: "125 000 FCFA" },
];

const data = [
  { name: "Lundi", value: 20000 },
  { name: "Mardi", value: 30000 },
  { name: "Mer", value: 25000 },
  { name: "Jeudi", value: 50000 },
  { name: "Vendredi", value: 100000 },
  { name: "S", value: 75000 },
  { name: "D", value: 85000 },
];

const orders = new Array(4).fill({
  id: "#1804202501",
  date: "18-avril-2021 à 09:08",
  total: "15 800 FCFA",
  table: "T01",
  status: "en cuisine",
  paid: true,
});

export default function Analyses() {
  return (
    <DashboardLayout>
    <div className="p-6 space-y-6 bg-white">
      <h2 className="text-lg font-semibold">Dans cet espace, vous pouvez voir vos stats</h2>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white shadow rounded-xl p-4">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Graphique + Plat du jour */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded-xl p-4 lg:col-span-2">
          <h3 className="font-semibold mb-2">Revenus par jour</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          <div className="bg-white shadow rounded-xl p-4">
            <p className="text-sm text-gray-500">Jour le plus rentable</p>
            <p className="text-lg font-semibold">Vendredi</p>
            <p className="text-sm text-gray-500">50 commandes</p>
            <p className="text-sm font-semibold">Gain : 150 000 FCFA</p>
          </div>

          <div className="bg-white shadow rounded-xl p-4 flex items-center gap-4">
            <img
              src="https://outam.onrender.com/assets/p.jpeg"
              alt="Plat du jour"
              className="w-12 h-12 rounded"
            />
            <div>
              <p className="text-sm">Œuf brûlé aux jambons</p>
              <p className="text-xs text-blue-600 underline">Petit-déjeuner</p>
            </div>
          </div>
        </div>
      </div>

      {/* Historique des commandes */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Historique des commandes</h3>
        <div className="space-y-4">
          {orders.map((order, i) => (
            <div
              key={i}
              className="bg-white shadow rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="bg-pink-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                  🍽️
                </div>
                <div>
                  <p className="font-semibold">Commande {order.id}</p>
                  <p className="text-xs text-gray-500">{order.date}</p>
                </div>
              </div>

              <div className="text-center">
                <p className="font-semibold">{order.total}</p>
                <p className="text-xs text-gray-500">Table : {order.table}</p>
              </div>

              <div className="text-center">
                <span className="text-xs px-2 py-1 bg-pink-200 text-pink-800 rounded-full">
                  {order.status}
                </span>
                <p className="text-green-600 text-sm">Payé</p>
              </div>

              <div className="flex items-center gap-2">
                <button className="bg-blue-600 text-white text-xs px-3 py-1 rounded-md hover:bg-blue-700">
                  Changer le status
                </button>
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
}
