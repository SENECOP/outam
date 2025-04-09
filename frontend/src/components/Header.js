import { Menu } from "lucide-react";
import { useAppContext } from "../context/AppContext"; // Importer le contexte

export default function Header({ toggleSidebar }) {
  const { currentRestaurant } = useAppContext(); // Récupérer les données du restaurant depuis le contexte

  return (
    <header className="bg-white shadow p-4 ml-0 flex items-center relative z-20">
      {/* Bouton de menu visible sur mobile et desktop */}
      <button 
        onClick={toggleSidebar} 
        className="text-gray-600 focus:outline-none z-20 md:hidden" // Visible sur mobile et cache sur les écrans plus larges
      >
        <Menu size={24} />
      </button>

      {/* Affichage du nom du restaurant */}
      <h1 className="text-xl font-bold ml-4">{currentRestaurant?.name || "Restaurant"}</h1>

      {/* Logo à droite */}
      <div className="ml-auto flex items-center space-x-4">
        {/* Logo */}
        <img
          src="https://outam.onrender.com/assets/logo.png" // Logo de haute qualité
          alt="Logo"
          className="w-16 h-16 object-contain" // Taille ajustée et image non déformée
        />
      </div>
    </header>
  );
}
