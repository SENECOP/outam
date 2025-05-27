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

export default function Public() {
  const data = {
    visitors: 54000,
    followers: 18500,
    engagementRate: 7.4,
    mentions: 1250,
    shares: 3200,
    monthlyVisitors: [
      3200, 4100, 3900, 4200, 4800, 4600, 5200, 5800, 6000, 6100, 6300, 6700,
    ],
    trafficSources: [
      { source: "Direct", percent: 38, color: "#3b82f6" },
      { source: "Social", percent: 27, color: "#ef4444" },
      { source: "Organique", percent: 22, color: "#10b981" },
      { source: "Referral", percent: 13, color: "#f59e0b" },
    ],
    followersByPlatform: [
      { platform: "Facebook", count: 8200, color: "#1877f2" },
      { platform: "Instagram", count: 5600, color: "#e4405f" },
      { platform: "Twitter", count: 3200, color: "#1da1f2" },
      { platform: "LinkedIn", count: 1500, color: "#0a66c2" },
    ],
    campaignProgress: {
      budgetUsed: 72,
      leadsGenerated: 1580,
      conversions: 320,
    },
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Public</h2>

      {/* Indicateurs clés */}
      <div className="grid grid-cols-5 gap-6 mb-10">
        <div className="bg-gray-50 rounded-lg p-4 text-center shadow-sm">
          <p className="text-gray-500 text-sm">Visiteurs mensuels</p>
          <p className="text-3xl font-bold text-gray-700">
            {data.visitors.toLocaleString()}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-center shadow-sm">
          <p className="text-gray-500 text-sm">Abonnés</p>
          <p className="text-3xl font-bold text-blue-600">
            {data.followers.toLocaleString()}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-center shadow-sm">
          <p className="text-gray-500 text-sm">Taux d’engagement</p>
          <ProgressCircle value={data.engagementRate * 10} color="#ef4444" />
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-center shadow-sm">
          <p className="text-gray-500 text-sm">Mentions</p>
          <p className="text-3xl font-bold text-gray-700">
            {data.mentions.toLocaleString()}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-center shadow-sm">
          <p className="text-gray-500 text-sm">Partages</p>
          <p className="text-3xl font-bold text-gray-700">
            {data.shares.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-3 gap-8">
        {/* Evolution visiteurs 12 mois */}
        <div className="bg-white p-6 rounded-lg shadow-sm col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Evolution des visiteurs (12 mois)
          </h3>
          <svg width="100%" height="180" viewBox="0 0 720 180">
            {data.monthlyVisitors.map((val, i) => (
              <rect
                key={"visitor" + i}
                x={i * 60 + 20}
                y={180 - (val / 7000) * 180}
                width="30"
                height={(val / 7000) * 180}
                fill="#3b82f6"
                rx="4"
              />
            ))}
          </svg>
          <div className="flex justify-between text-xs text-gray-400 mt-2 px-2">
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
        </div>

        {/* Répartition sources trafic */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Répartition sources trafic
          </h3>
          <svg width="100%" height="180" viewBox="0 0 200 200" className="mx-auto">
            {data.trafficSources.reduce((acc, cur, i) => {
              const total = data.trafficSources.reduce((sum, c) => sum + c.percent, 0);
              const startAngle = acc.angle || 0;
              const percentAngle = cur.percent * 3.6;
              const endAngle = startAngle + percentAngle;

              // Arc coords
              const radius = 80;
              const cx = 100;
              const cy = 100;
              const radStart = (Math.PI / 180) * startAngle;
              const radEnd = (Math.PI / 180) * endAngle;
              const x1 = cx + radius * Math.cos(radStart);
              const y1 = cy + radius * Math.sin(radStart);
              const x2 = cx + radius * Math.cos(radEnd);
              const y2 = cy + radius * Math.sin(radEnd);
              const largeArcFlag = percentAngle > 180 ? 1 : 0;

              acc.paths.push(
                <path
                  key={cur.source}
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
              Trafic
            </text>
          </svg>
          <div className="mt-4 space-y-2">
            {data.trafficSources.map((c) => (
              <div key={c.source} className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: c.color }}
                ></div>
                <span className="text-gray-700 font-medium">{c.source}</span>
                <span className="text-gray-500 ml-auto">{c.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Followers par plateforme */}
      <div className="mt-12 bg-white p-6 rounded-lg shadow-sm max-w-4xl mx-auto">
        <h3 className="text-lg font-semibold mb-6 text-gray-700">
          Abonnés par plateforme
        </h3>
        <div className="grid grid-cols-4 gap-6 text-center">
          {data.followersByPlatform.map(({ platform, count, color }) => (
            <div key={platform} className="bg-gray-50 rounded-lg p-4 shadow-sm">
              <p className="font-semibold text-gray-700 mb-2">{platform}</p>
              <p className="text-2xl font-bold" style={{ color }}>
                {count.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Campagne publicitaire */}
      <div className="mt-12 bg-white p-6 rounded-lg shadow-sm max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold mb-6 text-gray-700">
          Campagne publicitaire
        </h3>
        <p className="text-gray-700 mb-2">
          Budget utilisé:{" "}
          <span className="font-semibold">{data.campaignProgress.budgetUsed}%</span>
        </p>
        <div className="w-full bg-gray-100 rounded-full h-4">
          <div
            className="h-4 rounded-full bg-red-500"
            style={{ width: `${data.campaignProgress.budgetUsed}%` }}
          />
        </div>

        <div className="flex justify-between mt-4 text-gray-700 font-semibold">
          <div>
            Leads générés
            <p className="text-2xl">{data.campaignProgress.leadsGenerated}</p>
          </div>
          <div>
            Conversions
            <p className="text-2xl">{data.campaignProgress.conversions}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
