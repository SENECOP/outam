import { Home, List, ShoppingCart, BarChart, User,LogOut } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie"; // Importation de la gestion des cookies

export default function Sidebar({ isSidebarOpen }) {
  const { user } = useAppContext();
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken", "refreshToken"]);

  const handleLogout = () => {
    // Supprimer les cookies d'authentification
    removeCookie("accessToken", { path: "/" });
    removeCookie("refreshToken", { path: "/" });

    // Rediriger l'utilisateur vers la page de connexion
    navigate("/loginrestaurant");
  };
  return (
    
    <aside
    className={`bg-[#f8f8f8] text-black p-4 flex flex-col space-y-4 transition-all duration-300
      ${isSidebarOpen ? "w-64 visible" : "w-0 overflow-hidden invisible"} fixed md:relative h-full`}
  >
  
      {/* Contenu de la sidebar */}
      <div className="flex items-center space-x-4">
      {user?.photoDeProfil && (
                            <img
                                src={user.photoDeProfil}
                                alt="Profil"
                                className="w-12 h-12 rounded-lg"
                            />
                        )}        
                        
          <span className="font-semibold">{user.name || "Nom inconnu"}</span>      </div>
      <h2 className="text-xl font-bold">Mon Compte</h2>
      <nav className="flex flex-col space-y-2">
        {/* Liens de la sidebar */}
        <a href="#" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
  <div className="bg-blue-500 p-2 rounded-full"> {/* Fond bleu pour l'icône Accueil */}
    <Home size={20} className="text-white" /> {/* Icône en blanc pour contraster */}
  </div>
  <span>Accueil</span>
</a>

<a href="#" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
  <div className="bg-green-500 p-2 rounded-full"> {/* Fond vert pour l'icône Menu */}
    <List size={20} className="text-white" />
  </div>
  <span>Menu</span>
</a>

<a href="#" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
  <div className="bg-yellow-500 p-2 rounded-full"> {/* Fond jaune pour l'icône Commandes */}
    <ShoppingCart size={20} className="text-white" />
  </div>
  <span>Commandes</span>
</a>

<a href="#" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
  <div className="bg-purple-500 p-2 rounded-full"> {/* Fond violet pour l'icône Analyse des données */}
    <BarChart size={20} className="text-white" />
  </div>
  <span>Analyse des données</span>
</a>

<a href="#" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
  <div className="bg-pink-500 p-2 rounded-full"> {/* Fond rose pour l'icône Compte et profils */}
    <User size={20} className="text-white" />
  </div>
  <span>Compte et profils</span>
</a>

<a href="#" onClick={handleLogout} className="flex items-center space-x-2 hover:bg-red-100 p-2 rounded">
      <div className="bg-red-500 p-2 rounded-full">
        {/* Icône de déconnexion */}
        <LogOut size={20} className="text-white" />
      </div>
      <span>Déconnexion</span>
    </a>
      </nav>
    </aside>
  );
}