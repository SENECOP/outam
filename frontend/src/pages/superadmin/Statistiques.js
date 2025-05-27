import React from "react";

function ProgressCircle({ value, color }) {
  const angle = (value / 100) * 283; // approx circumference of circle (2πr with r=45)
  return (
    <svg width="60" height="60" className="mx-auto">
      <circle
        cx="30"
        cy="30"
        r="27"
        fill="none"
        stroke="#F1F3FA"
        strokeWidth="6"
      />
      <circle
        cx="30"
        cy="30"
        r="27"
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeDasharray={`${angle}, 283`}
        transform="rotate(-90 30 30)"
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy="0.35em"
        className="fill-gray-700 font-semibold"
      >
        {value}%
      </text>
    </svg>
  );
}

function ProgressBar({ value, color }) {
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-4">
      <div
        className="h-1.5 rounded-full"
        style={{ width: `${value}%`, background: color }}
      />
    </div>
  );
}

export default function Statistiques() {
  // Exemple de données simulées
  const stats = {
    totalVisits: 12500,
    conversionRate: 58,
    bounceRate: 22,
    averageSessionTime: 5.6, // en minutes
    salesIncrease: 34, // en %
  };

  return (
    <div className="p-6 bg-white rounded-lg min-h-screen px-6 py-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Statistiques</h2>

      {/* Indicateurs clés */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        <div className="bg-gray-50 rounded-lg p-4 text-center shadow-sm">
          <p className="text-gray-500 text-sm">Visites totales</p>
          <p className="text-3xl font-bold text-gray-700">{stats.totalVisits}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-center shadow-sm">
          <p className="text-gray-500 text-sm">Taux de conversion</p>
          <ProgressCircle value={stats.conversionRate} color="#3b82f6" />
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-center shadow-sm">
          <p className="text-gray-500 text-sm">Taux de rebond</p>
          <ProgressCircle value={stats.bounceRate} color="#ef4444" />
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-center shadow-sm">
          <p className="text-gray-500 text-sm">Temps moyen par session (min)</p>
          <p className="text-3xl font-bold text-gray-700">{stats.averageSessionTime}</p>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-2 gap-8">
        {/* Bar chart simplifié */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Visites par jour</h3>
          <svg width="100%" height="150" viewBox="0 0 400 150">
            {[50, 70, 100, 90, 120, 80, 60].map((val, i) => (
              <rect
                key={i}
                x={i * 50 + 10}
                y={150 - val}
                width="30"
                height={val}
                fill="#3b82f6"
                rx="5"
              />
            ))}
          </svg>
          <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
            {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
        </div>

        {/* Ligne courbe simplifiée */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Augmentation des ventes</h3>
          <svg width="100%" height="150" viewBox="0 0 400 150" className="stroke-blue-500">
            <polyline
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              points="0,140 50,130 100,100 150,70 200,60 250,40 300,30 350,20 400,10"
            />
          </svg>
          <p className="mt-4 text-green-600 font-semibold">
            +{stats.salesIncrease}% cette semaine
          </p>
        </div>
      </div>

      {/* Progress bar exemple */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Objectif de conversion</h3>
        <ProgressBar value={stats.conversionRate} color="#3b82f6" />
      </div>
    </div>
  );
}
