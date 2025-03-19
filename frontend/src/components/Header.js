import { Menu } from "lucide-react";

export default function Header({ toggleSidebar }) {
  return (
    <header className="bg-white shadow p-4 flex items-center">
      {/* Bouton de menu */}
      <button
        onClick={toggleSidebar}
        className=""
      >
        <Menu size={24} />
      </button>

      {/* Titre placé juste après le bouton */}
      <h1 className="text-xl font-bold ml-4">Restaurant Chez Salim</h1>

      {/* Logo à droite */}
      <div className="ml-auto mr-4"> {/* Conteneur du logo sans fond ni bordure */}
        <img
          src="assets/logo.png" // Logo de haute qualité
          alt="Logo"
          className="w-16 h-16 object-contain" // Taille ajustée et image non déformée
        />
      </div>
    </header>
  );
}