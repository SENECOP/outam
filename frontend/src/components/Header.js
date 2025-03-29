import { Menu } from 'lucide-react';

export default function Header({ toggleSidebar, nom }) {
  return (
    <header className="bg-white shadow p-4 ml-0 flex items-center">
      {/* Bouton de menu */}
      <button onClick={toggleSidebar} className="">
        <Menu size={24} />
      </button>

      {/* Affichage du nom du restaurant */}
      <h1 className="text-xl font-bold ml-4">{nom || 'Restaurant'}</h1>

      {/* Logo à droite */}
      <div className="ml-auto flex items-center space-x-4">
        {/* Si la photo de profil est disponible, l'afficher */}
        {/* Ajoutez ici la logique pour afficher la photo de profil */}
        <img
          src="assets/logo.png" // Logo de haute qualité
          alt="Logo"
          className="w-16 h-16 object-contain" // Taille ajustée et image non déformée
        />
      </div>
    </header>
  );
}
