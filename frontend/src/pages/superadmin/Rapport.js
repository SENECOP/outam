import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function Rapport() {
  const rapports = {
    mensuel: {
      utilisateursActifs: 1200,
      revenus: 45000,
      conversions: 230,
      tauxConversion: "19.2%",
      paniersMoyens: "37.50 €",
      rebond: "42%",
    },
    annuel: {
      utilisateursActifs: 14500,
      revenus: 550000,
      conversions: 4800,
      tauxConversion: "15.3%",
      paniersMoyens: "41.20 €",
      rebond: "38%",
    },
    topProduits: [
      { nom: "Pizza Margherita", ventes: 1320 },
      { nom: "Burger Classic", ventes: 980 },
      { nom: "Sushi Box", ventes: 770 },
    ],
    zonesActives: [
      { ville: "Paris", utilisateurs: 3500 },
      { ville: "Lyon", utilisateurs: 1800 },
      { ville: "Marseille", utilisateurs: 1200 },
    ],
  };

  const dataLine = {
    labels: ["Jan", "Fév", "Mars", "Avr", "Mai", "Juin"],
    datasets: [
      {
        label: "Revenus Mensuels (€)",
        data: [30000, 35000, 40000, 42000, 45000, 47000],
        fill: false,
        borderColor: "#3b82f6",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="p-6 space-y-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">Rapports détaillés</h1>

      {/* Statistiques mensuelles */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {Object.entries(rapports.mensuel).map(([key, value]) => (
          <div
            key={key}
            className="bg-white p-4 rounded shadow text-center border"
          >
            <h3 className="text-sm font-medium text-gray-500 uppercase">{key.replace(/([A-Z])/g, ' $1')}</h3>
            <p className="text-xl font-semibold text-gray-800">{value}</p>
          </div>
        ))}
      </div>

      {/* Courbe de revenus */}
      <section className="bg-white p-6 rounded shadow border">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Évolution des revenus</h2>
        <Line data={dataLine} />
      </section>

      {/* Produits les plus vendus */}
      <section className="bg-white p-6 rounded shadow border">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Top Produits</h2>
        <ul className="space-y-2">
          {rapports.topProduits.map((p) => (
            <li key={p.nom} className="flex justify-between text-gray-700">
              <span>{p.nom}</span>
              <span className="font-semibold">{p.ventes} ventes</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Zones géographiques actives */}
      <section className="bg-white p-6 rounded shadow border">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Zones Actives</h2>
        <ul className="space-y-2">
          {rapports.zonesActives.map((z) => (
            <li key={z.ville} className="flex justify-between text-gray-700">
              <span>{z.ville}</span>
              <span className="font-semibold">{z.utilisateurs} utilisateurs</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Analyse */}
      <section className="bg-white p-6 rounded shadow border">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Analyse</h2>
        <p className="text-gray-600">
          La performance globale est en hausse avec une augmentation du panier moyen et un taux de rebond en baisse.
          Les utilisateurs actifs progressent notamment à Paris et Lyon.
        </p>
      </section>
    </div>
  );
}
