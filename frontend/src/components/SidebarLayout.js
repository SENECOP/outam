import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function SidebarLayout() {
  // État pour contrôler l'ouverture/fermeture de la sidebar
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Fonction pour basculer l'état de la sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} />

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">
        {/* Header avec bouton TOUJOURS visible */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Contenu principal */}
        <main className="p-4">
          <p>Bienvenue sur votre tableau de bord.</p>
        </main>
      </div>
    </div>
  );
}