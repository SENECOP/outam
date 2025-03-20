import { useState } from "react";
import { Home, List, ShoppingCart, BarChart, User, LogOut, Menu, BookOpen, LayoutDashboard } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function SidebarLayout() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
      setSidebarOpen(!isSidebarOpen);
    };

  const menuItems = [
    {
      title: "Menu du restaurant",
      description: "Modifiez, mettez à jour et gérez votre menu.",
      icon: <LayoutDashboard className="w-6 h-6 text-blue-600" />,
    },
    {
      title: "Commandes clients",
      description: "Suivez et gérez les commandes de vos clients.",
      icon: <ShoppingCart className="w-6 h-6 text-red-500" />,
    },
    {
      title: "Analyse des données",
      description: "Consultez les statistiques et performances.",
      icon: <BarChart className="w-6 h-6 text-green-500" />,
    },
    {
      title: "Compte et profils",
      description: "Gérez vos informations personnelles.",
      icon: <User className="w-6 h-6 text-orange-500" />,
    },
  ];

  return (
    
    <div className="h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} />

      <div className="w-full max-w-4xl bg-gray-100 rounded-lg shadow-lg">
        {/* Header */}
        <Header toggleSidebar={toggleSidebar}/>

        {/* Contenu principal */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Bonjour Salim !</h2>

          <div className="space-y-4">
            {menuItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-md">
                {item.icon}
                <div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
