import React from "react";

function ProgressCircle({ value, color }) {
  const angle = (value / 100) * 283;
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
    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
      <div
        className="h-1.5 rounded-full"
        style={{ width: `${value}%`, background: color }}
      />
    </div>
  );
}

export default function Finances() {
  const finances = {
    revenue: 120000,
    expenses: 68000,
    profit: 52000,
    profitMargin: 43,
    cashFlow: 34000,
    debts: 45000,
    assets: 130000,
    liabilities: 45000,
    debtRatio: 35, // %
    budgetUsed: {
      marketing: 65,
      rnd: 45,
      operations: 78,
    },
    monthlyRevenues: [
      9000, 10000, 9500, 11000, 10500, 11500, 12000, 13000, 12500, 14000, 13500, 15000,
    ],
    monthlyExpenses: [
      6000, 7000, 6500, 7200, 6800, 7300, 7500, 7900, 7800, 8200, 8000, 8600,
    ],
    expenseCategories: [
      { category: "Marketing", amount: 21000, color: "#ef4444" },
      { category: "Salaires", amount: 28000, color: "#3b82f6" },
      { category: "R&D", amount: 10000, color: "#f59e0b" },
      { category: "Opérationnel", amount: 9000, color: "#10b981" },
    ],
  };

  // Somme totale dépenses (pour % par catégorie)
  const totalExpenses = finances.expenseCategories.reduce(
    (sum, e) => sum + e.amount,
    0
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm min-h-screen px-6 py-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Finances</h2>

      {/* Indicateurs clés */}
      <div className="grid grid-cols-6 gap-6 mb-10">
        <div className="bg-gray-50 rounded-lg p-4 text-center shadow-sm">
          <p className="text-gray-500 text-sm">Revenus totaux</p>
          <p className="text-3xl font-bold text-gray-700">
            {finances.revenue.toLocaleString()} €
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-center shadow-sm">
          <p className="text-gray-500 text-sm">Dépenses</p>
          <p className="text-3xl font-bold text-red-600">
            {finances.expenses.toLocaleString()} €
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-center shadow-sm">
          <p className="text-gray-500 text-sm">Bénéfices</p>
          <p className="text-3xl font-bold text-green-700">
            {finances.profit.toLocaleString()} €
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-center shadow-sm">
          <p className="text-gray-500 text-sm">Marge bénéficiaire</p>
          <ProgressCircle value={finances.profitMargin} color="#10b981" />
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-center shadow-sm">
          <p className="text-gray-500 text-sm">Cash Flow</p>
          <p className="text-3xl font-bold text-gray-700">
            {finances.cashFlow.toLocaleString()} €
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-center shadow-sm">
          <p className="text-gray-500 text-sm">Ratio d’endettement</p>
          <ProgressCircle value={finances.debtRatio} color="#ef4444" />
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-3 gap-8">
        {/* Revenus vs Dépenses sur 12 mois */}
        <div className="bg-white p-6 rounded-lg shadow-sm col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Revenus vs Dépenses (12 mois)
          </h3>
          <svg width="100%" height="180" viewBox="0 0 720 180">
            {/* Revenus */}
            {finances.monthlyRevenues.map((val, i) => (
              <rect
                key={"rev" + i}
                x={i * 60 + 10}
                y={180 - (val / 16000) * 180}
                width="20"
                height={(val / 16000) * 180}
                fill="#10b981"
                rx="3"
              />
            ))}
            {/* Dépenses */}
            {finances.monthlyExpenses.map((val, i) => (
              <rect
                key={"dep" + i}
                x={i * 60 + 35}
                y={180 - (val / 16000) * 180}
                width="20"
                height={(val / 16000) * 180}
                fill="#ef4444"
                rx="3"
              />
            ))}
          </svg>
          <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
            {[
              "Jan",
              "Fév",
              "Mar",
              "Avr",
              "Mai",
              "Juin",
              "Juil",
              "Août",
              "Sep",
              "Oct",
              "Nov",
              "Déc",
            ].map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
          <div className="flex space-x-4 mt-3 text-sm">
            <span className="flex items-center text-green-600">
              <span className="inline-block w-3 h-3 bg-green-600 rounded-full mr-2" />{" "}
              Revenus
            </span>
            <span className="flex items-center text-red-600">
              <span className="inline-block w-3 h-3 bg-red-600 rounded-full mr-2" />{" "}
              Dépenses
            </span>
          </div>
        </div>

        {/* Répartition des dépenses */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Répartition des dépenses
          </h3>
          <svg width="100%" height="180" viewBox="0 0 200 200" className="mx-auto">
            {finances.expenseCategories.reduce((acc, cur, i) => {
              const total = finances.expenseCategories.reduce((sum, c) => sum + c.amount, 0);
              const percent = (cur.amount / total) * 360;
              const startAngle = acc.angle || 0;
              const endAngle = startAngle + percent;

              // Coordonnées pour arc
              const radius = 80;
              const cx = 100;
              const cy = 100;
              const radStart = (Math.PI / 180) * startAngle;
              const radEnd = (Math.PI / 180) * endAngle;
              const x1 = cx + radius * Math.cos(radStart);
              const y1 = cy + radius * Math.sin(radStart);
              const x2 = cx + radius * Math.cos(radEnd);
              const y2 = cy + radius * Math.sin(radEnd);
              const largeArcFlag = percent > 180 ? 1 : 0;

              acc.paths.push(
                <path
                  key={cur.category}
                  d={`M${cx} ${cy} L${x1} ${y1} A${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  fill={cur.color}
                />
              );

              acc.angle = endAngle;
              return acc;
            }, { angle: 0, paths: [] }).paths}
            <circle cx="100" cy="100" r="45" fill="white" />
            <text
              x="100"
              y="110"
              textAnchor="middle"
              className="text-gray-700 font-semibold"
              style={{ fontSize: "1rem" }}
            >
              Dépenses
            </text>
          </svg>
          <div className="mt-4 space-y-2">
            {finances.expenseCategories.map((c) => (
              <div key={c.category} className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: c.color }}
                ></div>
                <span className="text-gray-700 font-medium">{c.category}</span>
                <span className="text-gray-500 ml-auto">
                  {((c.amount / totalExpenses) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Budgets par département */}
      <div className="mt-12 bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-6 text-gray-700">
          Utilisation des budgets par département
        </h3>
        <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto">
          {Object.entries(finances.budgetUsed).map(([dep, val]) => (
            <div key={dep} className="text-center">
              <p className="capitalize text-gray-600 mb-2">{dep}</p>
              <ProgressBar
                value={val}
                color={
                  val > 70
                    ? "#ef4444"
                    : val > 40
                    ? "#f59e0b"
                    : "#10b981"
                }
              />
              <p className="mt-2 text-gray-700 font-semibold">{val}% utilisé</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
