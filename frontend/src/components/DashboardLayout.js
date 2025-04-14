import { useState } from "react";
import { Home, List, ShoppingCart, BarChart, User, LogOut, Menu } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export default function DashboardLayout({ children }) {
  const { user, currentRestaurant } = useAppContext();
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken", "refreshToken"]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  const handleLogout = () => {
    removeCookie("accessToken", { path: "/" });
    removeCookie("refreshToken", { path: "/" });
    navigate("/loginrestaurant");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
  className={`
    bg-[#f8f8f8] text-black p-4 flex flex-col space-y-4 transition-all duration-300 z-10
    fixed h-full top-0 left-0
    ${isSidebarOpen ? 'w-64 visible' : 'w-0 invisible overflow-hidden'}
    md:relative md:visible md:w-64 md:block
  `}
>

        <div className="flex items-center space-x-4">
          {user?.photoDeProfil && (
            <img
              src={user.photoDeProfil}
              alt="Profil"
              className="w-12 h-12 rounded-lg"
            />
          )}
          <span className="font-semibold">{user.name || "Nom inconnu"}</span>
        </div>

        <h2 className="text-xl font-bold">Mon Compte</h2>
        <nav className="flex flex-col space-y-2">
          <a href="#" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
            <div className="bg-blue-500 p-2 rounded-full">
              <Home size={20} className="text-white" />
            </div>
            <span>Accueil</span>
          </a>

          <a href="#" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
            <div className="bg-green-500 p-2 rounded-full">
              <List size={20} className="text-white" />
            </div>
            <span>Menu</span>
          </a>

          <a href="#" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
            <div className="bg-yellow-500 p-2 rounded-full">
              <ShoppingCart size={20} className="text-white" />
            </div>
            <span>Commandes</span>
          </a>

          <a href="#" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
            <div className="bg-purple-500 p-2 rounded-full">
              <BarChart size={20} className="text-white" />
            </div>
            <span>Analyse des données</span>
          </a>

          <a href="#" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
            <div className="bg-pink-500 p-2 rounded-full">
              <User size={20} className="text-white" />
            </div>
            <span>Compte et profils</span>
          </a>

          <a onClick={handleLogout} className="flex items-center space-x-2 hover:bg-red-100 p-2 rounded cursor-pointer">
            <div className="bg-red-500 p-2 rounded-full">
              <LogOut size={20} className="text-white" />
            </div>
            <span>Déconnexion</span>
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow p-4 ml-0 flex items-center relative z-20">
          <button
            onClick={toggleSidebar}
            className="text-gray-600 focus:outline-none z-20 md:hidden"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-bold ml-4">{currentRestaurant?.name || "Restaurant"}</h1>
          <div className="ml-auto flex items-center space-x-4">
            <img
              src="https://outam.onrender.com/assets/logo.png"
              alt="Logo"
              className="w-16 h-16 object-contain"
            />
          </div>
        </header>

        {/* Contenu */}
        <main className="p-4 bg-gray-50 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
