import React, { useState } from "react";
import RestaurantList from "./RestaurantList";
import Publicité from "./Publicité";
import Statistiques from "./Statistiques";
import Finances from "./Finances";
import Public from "./Public";
import Rapport from "./Rapport";
import Parametres from "./Parametres";
import { useAdminAuth } from "./AdminAuthContext";
import { useNavigate } from 'react-router-dom';


// For dummy charts, you can use packages like react-chartjs-2 or recharts. Here we use SVG placeholders.
// In a real project, replace SVGs with chart components.
function TeamCards() {
  const users = [
    {
      name: "Chadengle",
      email: "coderthemes@gmail.com",
      avatar: "https://randomuser.me/api/portraits/men/31.jpg",
      role: "Administrateur",
      color: "text-yellow-500",
    },
    {
      name: "Michel Zenaty",
      email: "coderthemes@gmail.com",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      role: "Responsable du soutien",
      color: "text-gray-500",
    },
    {
      name: "Toujours pas David",
      email: "coderthemes@gmail.com",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      role: "Designer",
      color: "text-green-500",
    },
    {
      name: "Thomaslau",
      email: "coderthemes@gmail.com",
      avatar: "https://randomuser.me/api/portraits/women/45.jpg",
      role: "Promoteur",
      color: "text-blue-500",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-6 mt-8">
      {users.map((user, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center min-w-[230px]">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover mb-4"
          />
          <div className="text-center">
            <div className="font-semibold text-gray-700 text-lg">{user.name}</div>
            <div className="text-gray-400 text-sm truncate">{user.email}</div>
            <div className={`mt-2 font-semibold text-sm ${user.color}`}>
              {user.role}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
function ProgressCircle({ value, color }) {
  const angle = (value / 100) * 283; // 283 is approx circumference of 90 radius
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
        strokeDasharray={angle + ", 283"}
        transform="rotate(-90 30 30)"
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy="0.35em"
        className="fill-gray-700 font-semibold"
      >
        {value}
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
// function ProgressCircle({ value, color }) {
//   const angle = (value / 100) * 283;
//   return (
//     <svg width="60" height="60" className="mx-auto">
//       <circle
//         cx="30"
//         cy="30"
//         r="27"
//         fill="none"
//         stroke="#F1F3FA"
//         strokeWidth="6"
//       />
//       <circle
//         cx="30"
//         cy="30"
//         r="27"
//         fill="none"
//         stroke={color}
//         strokeWidth="6"
//         strokeDasharray={angle + ", 283"}
//         transform="rotate(-90 30 30)"
//       />
//       <text
//         x="50%"
//         y="50%"
//         textAnchor="middle"
//         dy="0.35em"
//         className="fill-gray-700 font-semibold"
//       >
//         {value}
//       </text>
//     </svg>
//   );
// }

// function ProgressBar({ value, color }) {
//   return (
//     <div className="w-full bg-gray-100 rounded-full h-1.5 mt-4">
//       <div
//         className="h-1.5 rounded-full"
//         style={{ width: `${value}%`, background: color }}
//       />
//     </div>
//   );
// }

// Message Box Section (Boîte de réception)
function Inbox() {
  const messages = [
    {
      name: "Chadengle",
      avatar: "https://randomuser.me/api/portraits/men/33.jpg",
      time: "13h40",
      msg: "Hé ! Je suis disponible...",
    },
    {
      name: "Thomaslau",
      avatar: "https://randomuser.me/api/portraits/men/34.jpg",
      time: "13h34",
      msg: "Je l'ai fini ! À bientôt...",
    },
    {
      name: "Toujours pas David",
      avatar: "https://randomuser.me/api/portraits/men/35.jpg",
      time: "13h17",
      msg: "Ce thème est génial !",
    },
    {
      name: "Kurafire",
      avatar: "https://randomuser.me/api/portraits/men/36.jpg",
      time: "12h20",
      msg: "Ravi de vous rencontrer",
    },
    {
      name: "Shahedk",
      avatar: "https://randomuser.me/api/portraits/men/37.jpg",
      time: "22h15",
      msg: "Hé ! Je suis disponible...",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex-1 min-w-[340px] max-w-[400px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg text-gray-700">Boîte de réception</h2>
        <i className="fas fa-ellipsis-v text-gray-400" />
      </div>
      <ul>
        {messages.map((msg, i) => (
          <li
            key={i}
            className={`flex items-center py-3 border-b border-gray-100 last:border-b-0`}
          >
            <img
              src={msg.avatar}
              alt={msg.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="ml-3 flex-1">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">{msg.name}</span>
                <span className="text-xs text-gray-400">{msg.time}</span>
              </div>
              <span className="text-gray-400 text-sm truncate block">{msg.msg}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Last Projects Section (Derniers projets)
function ProjectStatus({ status }) {
  // Choose color and label based on status
  const map = {
    "Libéré": "bg-red-100 text-red-600",
    "Libéré ": "bg-green-100 text-green-600",
    "En attente": "bg-pink-100 text-pink-600",
    "Travaux en cours": "bg-indigo-100 text-indigo-600",
    "À venir": "bg-yellow-100 text-yellow-700",
    "À venir ": "bg-blue-100 text-blue-600",
  };
  const color = map[status] || "bg-gray-100 text-gray-600";
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}>
      {status}
    </span>
  );
}

function LastProjects() {
  const projects = [
    {
      id: 1,
      name: "Adminto Admin v1",
      start: "01/01/2017",
      end: "26/04/2017",
      status: "Libéré",
      assign: "Thèmes de code",
    },
    {
      id: 2,
      name: "Adminto Frontend v1",
      start: "01/01/2017",
      end: "26/04/2017",
      status: "Libéré ",
      assign: "Adminto admin",
    },
    {
      id: 3,
      name: "Adminto Admin v1.1",
      start: "01/05/2017",
      end: "10/05/2017",
      status: "En attente",
      assign: "Thèmes de code",
    },
    {
      id: 4,
      name: "Adminto Frontend v1.1",
      start: "01/01/2017",
      end: "31/05/2017",
      status: "Travaux en cours",
      assign: "Adminto admin",
    },
    {
      id: 5,
      name: "Adminto Admin v1.3",
      start: "01/01/2017",
      end: "31/05/2017",
      status: "À venir",
      assign: "Thèmes de code",
    },
    {
      id: 6,
      name: "Adminto Admin v1.3",
      start: "01/01/2017",
      end: "31/05/2017",
      status: "À venir ",
      assign: "Adminto admin",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex-1 min-w-[500px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg text-gray-700">Derniers projets</h2>
        <i className="fas fa-ellipsis-v text-gray-400" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-spacing-y-2 border-separate">
          <thead>
            <tr className="text-gray-400 text-sm font-medium">
              <th className="py-2 pr-4">#</th>
              <th className="py-2 pr-4">Nom du projet</th>
              <th className="py-2 pr-4">Date de début</th>
              <th className="py-2 pr-4">Date d&apos;échéance</th>
              <th className="py-2 pr-4">Statut</th>
              <th className="py-2 pr-4">Attribuer</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p, i) => (
              <tr key={i} className="text-gray-700 text-sm border-b border-gray-100">
                <td className="py-2 pr-4">{p.id}</td>
                <td className="py-2 pr-4">{p.name}</td>
                <td className="py-2 pr-4">{p.start}</td>
                <td className="py-2 pr-4">{p.end}</td>
                <td className="py-2 pr-4"><ProjectStatus status={p.status} /></td>
                <td className="py-2 pr-4">{p.assign}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default function Dashboard() {
  const [activePage, setActivePage] = useState("");
  const { admin } = useAdminAuth();
  const navigate = useNavigate();

const handleLogout = () => {
  // Supprimer le token et les infos admin
  localStorage.removeItem('token');
  localStorage.removeItem('superAdmin');

  // Redirection vers la page de connexion
  navigate('/login');
};


  return (
    <div className="flex h-screen bg-[#F1F3FA]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="flex items-center px-8 py-6">
          <img src="assets/logo.png" alt="Logo" className="w-8 h-8 rounded-full" />
          <span className="text-2xl font-bold ml-2 text-[#ed4747]">Outam</span>
        </div>
        <div className="flex flex-col items-center">
  <img
    src={admin?.photoProfil || "https://dummyimage.com/100x100/ccc/fff.png&text=?"}
    className="w-16 h-16 rounded-full border-4 border-gray-200"
    alt={admin?.fullname || "Utilisateur"}
  />
  <p className="mt-3 font-semibold text-gray-700">{admin?.fullname || "Admin"}</p>
  <p className="text-gray-400 text-sm">{admin?.fonction || "Fonction inconnue"}</p>
  <div className="flex space-x-2 mt-2 text-gray-400">
  <button><i className="fas fa-cog" /></button>
  <button onClick={handleLogout}>
    <i className="fas fa-power-off" />
  </button>
</div>

</div>

      <nav className="flex-1 mt-8 px-6">
  <h5 className="text-xs mb-2 text-gray-400">NAVIGATION</h5>
  <ul className="space-y-4">
    <li className="flex items-center mb-4 text-[#2196F3] font-medium">
      <i className="fas fa-th-large mr-2" />
      General
      <span className="ml-auto bg-green-500 text-white text-xs rounded-full px-2">9+</span>
    </li>
  </ul>
  <h5 className="text-xs mt-6 mb-2 text-gray-400">APPLICATIONS</h5>
  <br/>
  <br/>
 <ul className="space-y-10 text-gray-600">
  <li
    className={`flex items-center cursor-pointer hover:text-blue-600 transition ${
      activePage === "administration" ? "font-bold text-blue-700" : ""
    }`}
    onClick={() => setActivePage("administration")}
  >
    <i className="fas fa-user-cog mr-2" /> Administration
  </li>

  <li
    className={`flex items-center cursor-pointer hover:text-blue-600 transition ${
      activePage === "statistiques" ? "font-bold text-blue-700" : ""
    }`}
    onClick={() => setActivePage("statistiques")}
  >
    <i className="fas fa-chart-bar mr-2" /> Statistiques
  </li>

  <li
    className={`flex items-center cursor-pointer hover:text-green-600 transition ${
      activePage === "finances" ? "font-bold text-green-700" : ""
    }`}
    onClick={() => setActivePage("finances")}
  >
    <i className="fas fa-wallet mr-2" /> Finances
  </li>

  <li
    className={`flex items-center cursor-pointer hover:text-blue-600 transition ${
      activePage === "publicite" ? "font-bold text-blue-700" : ""
    }`}
    onClick={() => setActivePage("publicite")}
  >
    <i className="fas fa-bullhorn mr-2" /> Publicité
  </li>

  <li
    className={`flex items-center cursor-pointer hover:text-purple-600 transition ${
      activePage === "rapport" ? "font-bold text-purple-700" : ""
    }`}
    onClick={() => setActivePage("rapport")}
  >
    <i className="fas fa-file-alt mr-2" /> Rapport
    {/* <i className="fas fa-chevron-right ml-auto text-xs" /> */}
  </li>

  {/* Paramètres */}
  <li
    className={`flex items-center cursor-pointer hover:text-gray-700 transition ${
      activePage === "parametres" ? "font-bold text-gray-900" : ""
    }`}
    onClick={() => setActivePage("parametres")}
  >
    <i className="fas fa-cogs mr-2" /> Paramètres
    {/* <i className="fas fa-chevron-right ml-auto text-xs" /> */}
  </li>
</ul>

</nav>
      </aside>

      {/* Main */}
     <main className="flex-1 p-8 overflow-auto">
  {activePage === "administration" && <RestaurantList />}
  {activePage === "publicite" && <Publicité />}
  {activePage === "statistiques" && <Statistiques />}
  {activePage === "finances" && <Finances />}
  {activePage === "public" && <Public />}
  {activePage === "rapport" && <Rapport />}
  {activePage === "parametres" && <Parametres />}

  {/* Tableau de bord par défaut */}
  {(!activePage ||
    (activePage !== "administration" &&
      activePage !== "publicite" &&
      activePage !== "statistiques" &&
      activePage !== "finances" &&
      activePage !== "public" &&
      activePage !== "rapport" &&
      activePage !== "parametres")) && (
    <>
      {/* Top bar */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Tableau de bord</h1>
        <div className="flex items-center space-x-4">
          <input
            className="bg-gray-100 rounded-full px-4 py-2 text-gray-500 focus:outline-none"
            placeholder="Recherche..."
          />
          <i className="far fa-bell text-xl text-gray-400 relative">
            <span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs rounded-full px-1">9</span>
          </i>
         <img
            src={admin.photoProfil}
            className="w-8 h-8 rounded-full border-2 border-gray-200"
            alt={admin.fullname}
          />
          <span>{admin.fullname}</span>
          <i className="fas fa-cog text-gray-400" />

        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        {/* Card 1 */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-gray-700">Revenu total</p>
              <div className="flex items-center mt-2">
                <ProgressCircle value={58} color="#ed4747" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-700">256</p>
                  <p className="text-gray-400 text-sm">Chiffre d'affaires aujourd'hui</p>
                </div>
              </div>
            </div>
            <i className="fas fa-ellipsis-v text-gray-400" />
          </div>
        </div>
        {/* Card 2 */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-gray-700">Analyse des ventes</p>
              <div className="flex items-center mt-2">
                <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-semibold mr-2">
                  32% <i className="fas fa-arrow-up" />
                </span>
                <p className="text-2xl font-bold text-gray-700">8451</p>
              </div>
              <p className="text-gray-400 text-sm">Chiffre d'affaires aujourd'hui</p>
              <ProgressBar value={64} color="#18c967" />
            </div>
            <i className="fas fa-ellipsis-v text-gray-400" />
          </div>
        </div>
        {/* Card 3 */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-gray-700">Statistiques</p>
              <div className="flex items-center mt-2">
                <ProgressCircle value={80} color="#ffbe0b" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-700">4569</p>
                  <p className="text-gray-400 text-sm">Chiffre d'affaires aujourd'hui</p>
                </div>
              </div>
            </div>
            <i className="fas fa-ellipsis-v text-gray-400" />
          </div>
        </div>
        {/* Card 4 */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-gray-700">Ventes quotidiennes</p>
              <div className="flex items-center mt-2">
                <span className="bg-pink-100 text-pink-600 px-2 py-1 rounded-full text-xs font-semibold mr-2">
                  32% <i className="fas fa-arrow-up" />
                </span>
                <p className="text-2xl font-bold text-gray-700">158</p>
              </div>
              <p className="text-gray-400 text-sm">Chiffre d'affaires aujourd'hui</p>
              <ProgressBar value={32} color="#ff82ad" />
            </div>
            <i className="fas fa-ellipsis-v text-gray-400" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-3 gap-6">
        {/* Pie Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <p className="font-semibold text-gray-700">Ventes quotidiennes</p>
            <i className="fas fa-ellipsis-v text-gray-400" />
          </div>
          {/* Dummy Pie */}
          <svg width="180" height="180" viewBox="0 0 180 180" className="mx-auto mb-4">
            <circle r="70" cx="90" cy="90" fill="none" stroke="#00bcd4" strokeWidth="30" strokeDasharray="120 300" />
            <circle
              r="70"
              cx="90"
              cy="90"
              fill="none"
              stroke="#ff82ad"
              strokeWidth="30"
              strokeDasharray="60 300"
              transform="rotate(-120 90 90)"
            />
            <circle
              r="70"
              cx="90"
              cy="90"
              fill="none"
              stroke="#7c4dff"
              strokeWidth="30"
              strokeDasharray="120 300"
              transform="rotate(120 90 90)"
            />
          </svg>
          <div className="flex justify-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center">
              <span className="w-3 h-3 bg-[#00bcd4] rounded-full mr-1"></span>In-Store Sales
            </span>
            <span className="flex items-center">
              <span className="w-3 h-3 bg-[#ff82ad] rounded-full mr-1"></span>Download Sales
            </span>
            <span className="flex items-center">
              <span className="w-3 h-3 bg-[#7c4dff] rounded-full mr-1"></span>Mail-Order Sales
            </span>
          </div>
        </div>
        {/* Bar Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <p className="font-semibold text-gray-700">Statistiques</p>
            <i className="fas fa-ellipsis-v text-gray-400" />
          </div>
          {/* Dummy Bar */}
          <svg width="200" height="130" className="mx-auto">
            <rect x="10" y="50" width="20" height="60" fill="#18a0fb" />
            <rect x="40" y="80" width="20" height="30" fill="#18a0fb" />
            <rect x="70" y="50" width="20" height="60" fill="#18a0fb" />
            <rect x="100" y="100" width="20" height="10" fill="#18a0fb" />
            <rect x="130" y="110" width="20" height="20" fill="#18a0fb" />
            <rect x="160" y="30" width="20" height="80" fill="#18a0fb" />
          </svg>
          <div className="flex justify-between mt-2 text-xs text-gray-400 px-2">
            <span>2010</span>
            <span>2011</span>
            <span>2012</span>
            <span>2013</span>
            <span>2014</span>
            <span>2015</span>
          </div>
        </div>
        {/* Line Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <p className="font-semibold text-gray-700">Revenu total</p>
            <i className="fas fa-ellipsis-v text-gray-400" />
          </div>
          {/* Dummy Line */}
          <svg width="200" height="130" className="mx-auto">
            <polyline fill="none" stroke="#18c967" strokeWidth="3" points="0,120 30,80 60,90 90,40 120,65 150,120 200,40" />
            <polyline fill="none" stroke="#18a0fb" strokeWidth="3" points="0,70 30,40 60,110 90,50 120,110 150,60 200,90" />
          </svg>
          <div className="flex justify-between mt-2 text-xs text-gray-400 px-2">
            <span>2008</span>
            <span>2009</span>
            <span>2010</span>
            <span>2011</span>
            <span>2012</span>
            <span>2013</span>
            <span>2014</span>
            <span>2015</span>
          </div>
        </div>
      </div>

      <TeamCards />

      <div className="grid grid-cols-2 gap-2 mt-4 ">
        <Inbox />
        <LastProjects />
      </div>
    </>
  )}
</main>

    </div>
  );
}