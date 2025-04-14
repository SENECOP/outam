import { Trash } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import EditMenuItemForm from "../components/EditMenuItemForm";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";

export default function CategoryManager() {
  
  // Utilisation du AppContext pour obtenir et manipuler les catégories
  const { categories, addCategory, removeCategory } = useAppContext();
  const [newCategory, setNewCategory] = useState("");

  const { id } = useParams();
  const { currentRestaurant } = useAppContext();
  const navigate = useNavigate();
  const restaurantId = currentRestaurant ? currentRestaurant._id : null;

  const handleQRCodeClick = (e) => {
    if (!currentRestaurant) {
      e.preventDefault();
      alert("Aucun restaurant sélectionné");
      navigate('/restaurants'); // Redirige vers la page de sélection 
    }
  };

  const addNewCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory)) {
      addCategory(newCategory);
      setNewCategory(""); // Reset after adding
    }
  };

  return (
    <DashboardLayout>
    <div className="flex h-screen bg-gray-100">
      {/* <Sidebar isSidebarOpen={true} /> */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <Header toggleSidebar={() => {}} /> */}
        <main className="flex-1 overflow-y-auto p-4 ml-1">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full mr-4 shadow-md">
                <BookOpen size={24} className="text-blue-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Menu du restaurant</h1>
            </div>

            <nav className="bg-white shadow-sm rounded-lg mb-6 p-4">
              <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0">
              <Link 
                to={`/restaurant/${restaurantId}`}
                className="text-gray-600 hover:text-gray-800 px-3 py-2"
              >
                Menu actuel
              </Link>
                <Link
                  to={`/gerermenu/${id}`}
                  className="text-gray-600 hover:text-gray-800 px-3 py-2"
                >
                  Gerer menu
                </Link>

                <Link
                  to={`/restaurant/${currentRestaurant._id}/menu/create`}
                  onClick={handleQRCodeClick}
                  className="text-gray-600 hover:text-gray-800 px-3 py-2"
                >
                  Créer un menu
                </Link>
                <Link
                  to={`/addcategorie/${id}`}
                  onClick={handleQRCodeClick}
                  className="font-medium text-blue-600 px-3 py-2 rounded-lg bg-blue-50"
                >
                  Creer une categorie
                </Link>
                <Link
                  to={currentRestaurant ? `/restaurants/${currentRestaurant._id}/qrcode` : "#"}
                  onClick={handleQRCodeClick}
                  className="text-gray-600 hover:text-gray-800 px-3 py-2"
                >
                  QR Code
                </Link>
                {/* <button className="text-gray-600 hover:text-gray-800 px-3 py-2">
                  Historique
                </button> */}
              </div>
            </nav>
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">

              <div className="bg-white shadow-sm rounded-lg mb-6 p-4">
                <h2 className="text-xl font-semibold mb-2">Créer une catégorie</h2>
                <p className="text-gray-600 mb-4">
                  Dans cet espace, vous pouvez créer vos catégories de Menu
                </p>

                <div className="flex flex-col md:flex-row gap-[160px]">
                  {/* Colonne de gauche - Nouvelle catégorie */}
                  <div className="flex-1">
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-1">Nouvelle catégorie</label>
                      <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full border p-2 rounded"
                        placeholder="Nom de la catégorie"
                      />
                    </div>

                    {/* Boutons */}
                    <div className="flex gap-2 mb-6">
                      <button
                        onClick={addNewCategory}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Enregistrer
                      </button>
                      <button
                        onClick={() => setNewCategory("")}
                        className="border border-green-600 text-green-600 px-4 py-2 rounded hover:bg-green-100"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>

                  {/* Colonne de droite - Liste des catégories */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">Liste des catégories</h3>
                    <div className="space-y-2">
                      {categories.map((category, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={category}
                            readOnly
                            className="border p-2 rounded flex-1"
                          />
                          <button
                            onClick={() => removeCategory(index)}
                            className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
    </DashboardLayout>
  );
}
