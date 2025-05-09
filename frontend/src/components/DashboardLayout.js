import { useState, useEffect, useRef } from "react";
import { Home, List, ShoppingCart, BarChart, User, LogOut, Menu } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function DashboardLayout({ children }) {
  const { user, currentRestaurant } = useAppContext();
  const navigate = useNavigate();
  const [cookies, , removeCookie] = useCookies(["accessToken", "refreshToken"]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isFirstLoad = useRef(true);
  const apiUrl = process.env.REACT_APP_API_URL;

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  // const handleLogout = () => {
  //   removeCookie("accessToken", { path: "/" });
  //   removeCookie("refreshToken", { path: "/" });
  //   navigate("/loginrestaurant");
  // };

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
    } else {
      // Garde l'état du sidebar inchangé après navigation
    }
  }, []);
  const handleLogout = () => {
    removeCookie("accessToken", { path: "/" });
    removeCookie("refreshToken", { path: "/" });
    navigate("/"); // redirection vers la page d'accueil après déconnexion
  };
  
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`
          bg-[#f8f8f8] text-black p-4 flex flex-col space-y-4 transition-transform duration-300 z-20
          fixed h-full top-0 left-0 w-64
          transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center space-x-4">
          <img
            src={
              user?.photoDeProfil?.startsWith("http")
                ? user.photoDeProfil
                : `https://outam.onrender.com/assets/${user?.photoDeProfil || 'user.jpeg'}`
            }
            alt="Profil"
            className="w-12 h-12 rounded-lg object-cover"
          />
          <span className="font-semibold">{user?.name || "Nom inconnu"}</span>
        </div>

        <h2 className="text-xl font-bold">Mon Compte</h2>
        <nav className="flex flex-col space-y-2">
        <Link 
  to="/homer"
  className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded text-gray-600 hover:text-gray-800"
>
  <div className="bg-blue-500 p-2 rounded-full">
    <Home size={20} className="text-white" />
  </div>
  <span>Accueil</span>
</Link>


<Link 
  to={`/restaurant/${currentRestaurant?._id || ''}/menu/create`} 
  className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded text-gray-600 hover:text-gray-800"
>
  <div className="bg-green-500 p-2 rounded-full">
    <List size={20} className="text-white" />
  </div>
  <span>Menu</span>
</Link>

<Link
  to={`/restaurant/${currentRestaurant?._id || ''}/orders`}
  className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded text-gray-600 hover:text-gray-800"
>
  <div className="bg-yellow-500 p-2 rounded-full">
    <ShoppingCart size={20} className="text-white" />
  </div>
  <span>Commandes</span>
</Link>

        <Link 
  to={`/restaurant/${currentRestaurant?._id || ''}/analyse`}
  className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded text-gray-600 hover:text-gray-800"
>
  <div className="bg-purple-500 p-2 rounded-full">
    <BarChart size={20} className="text-white" />
  </div>
  <span>Analyse des données</span>
</Link>

          <Link 
  to={`/profil/${user?.restaurantId || ''}`}
  className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded text-gray-600 hover:text-gray-800"
>
  <div className="bg-pink-500 p-2 rounded-full">
    <User size={20} className="text-white" />
  </div>
  <span>Compte et profils</span>
</Link>
<Link
  to="/"
  onClick={() => {
    removeCookie("accessToken", { path: "/" });
    removeCookie("refreshToken", { path: "/" });
  }}
  className="flex items-center space-x-2 hover:bg-red-100 p-2 rounded cursor-pointer"
>
  <div className="bg-red-500 p-2 rounded-full">
    <LogOut size={20} className="text-white" />
  </div>
  <span>Déconnexion</span>
</Link>
        </nav>
      </aside>

      {/* Main content */}
      <div className={`flex flex-col flex-1 overflow-auto transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Header */}
        <header className="bg-white shadow p-4 flex items-center relative z-10">
          <button onClick={toggleSidebar} className="text-gray-600 focus:outline-none z-20">
            <Menu size={24} />
          </button>
          <Home size={30} className="text-black ml-6 mr-2" />

          <h1 className="text-xl font-bold ml-4">{currentRestaurant?.name || "Restaurant"}</h1>
          <div className="ml-auto flex items-center space-x-4">
            <img
              src="https://outam.onrender.com/assets/logo.png"
              alt="Logo"
              className="w-16 h-16 object-contain"
            />
          </div>
        </header>

        {/* Content */}
        <main className="p-4 bg-gray-50 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
