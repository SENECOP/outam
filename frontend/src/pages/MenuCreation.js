import { useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

function MenuCreation() {
  const { currentRestaurant } = useAppContext();
  const restaurantId = currentRestaurant ? currentRestaurant._id : null;
  const [menuTitle, setMenuTitle] = useState("");
  const [dishes, setDishes] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  const [menuData, setMenuData] = useState({
    name: "",
    day: "lundi",
    dishes: []
  })
  const addDish = () => {
    setDishes([...dishes, { title: "", description: "", price: "", category: "" }]);
  };

  const handleDishChange = (index, field, value) => {
    const newDishes = [...dishes];
    newDishes[index][field] = value;
    setDishes(newDishes);
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`https://outam.onrender.com/api/restaurant/${restaurantId}/menus`, {
        name: menuTitle,
        day: "lundi",
        dishes,
      });
      alert("Menu créé avec succès");
    } catch (error) {
      console.error("Erreur lors de la création du menu", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 ml-1">
          <nav className="bg-white shadow-sm rounded-lg mb-6 p-4 mr-[500px]">
            <div className="flex space-x-6">
            <Link 
            to={`/restaurant/${restaurantId}`}
            className="text-gray-600 hover:text-gray-800 px-3 py-2"
          >
            Menu actuel
          </Link>
              <Link to={`/gerermenu/${restaurantId}`} className="text-gray-600 hover:text-gray-800 px-3 py-2">
                Gérer menu
              </Link>
              <Link to={`/restaurant/${restaurantId}/menu/create`} className="font-medium text-blue-600 px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                Créer un menu
              </Link>
              <Link to={`/restaurants/${restaurantId}/qrcode`} className="text-gray-600 hover:text-gray-800 px-3 py-2">
                QR Code
              </Link>
              <button className="text-gray-600 hover:text-gray-800 px-3 py-2">
                Historique
              </button>
            </div>
          </nav>
          <div className="bg-white shadow-sm rounded-lg mb-6 p-4 mr-[500px]">
            <h2 className="text-xl font-semibold mb-2">Création de menu</h2>
            <p className="text-gray-600 mb-4">Dans cet espace, vous pouvez créer un nouveau menu</p>
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                placeholder="Titre du menu"
                value={menuTitle}
                onChange={(e) => setMenuTitle(e.target.value)}
                className="w-3/4 p-2 border rounded"
              />
              <button className="bg-gray-300 px-4 py-2 rounded">Ignorer</button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                {dishes.map((dish, index) => (
                  <div key={index} className="mb-4 p-4 border rounded">
                    <input
                      type="text"
                      placeholder="Nom du plat"
                      value={dish.title}
                      onChange={(e) => handleDishChange(index, "title", e.target.value)}
                      className="w-full p-2 border rounded mb-2"
                    />
                    <input
                      type="text"
                      placeholder="Prix du plat"
                      value={dish.price}
                      onChange={(e) => handleDishChange(index, "price", e.target.value)}
                      className="w-full p-2 border rounded mb-2"
                    />
                    <textarea
                      placeholder="Description du plat"
                      value={dish.description}
                      onChange={(e) => handleDishChange(index, "description", e.target.value)}
                      className="w-full p-2 border rounded mb-2"
                    />
                    <input
                      type="file"
                      onChange={(e) => handleDishChange(index, "image", e.target.files[0])}
                      className="w-full p-2 border rounded mb-2"
                    />
                    <select
                      value={dish.category}
                      onChange={(e) => handleDishChange(index, "category", e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="Lunch">Lunch</option>
                      <option value="Brunch">Brunch</option>
                      <option value="Déjeuner">Déjeuner</option>
                      <option value="Dîner">Dîner</option>
                      <option value="Dessert">Dessert</option>
                    </select>
                  </div>
                ))}
                <button onClick={addDish} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  + Ajouter un plat
                </button>
              </div>
              <div>
              <h3 className="text-green-800 font-medium mb-3">Suggestions de plats</h3>
  <div className="bg-green-100 grid grid-cols-3 gap-2">
    {["Yassa poulet", "C'bon", "Mafé yapp", 
      "Kaldou", "Soup kandia", "Thiou boulette", 
      "Thiéb Dieun", "Soupe Yell", "Domoda"].map((suggestion) => (
      <button 
        key={suggestion}
        onClick={() => {
          // Ajoute le plat sélectionné à votre liste
          const newDish = {
            title: suggestion,
            description: "",
            price: "",
            category: "plat"
          };
          setMenuData(prev => ({
            ...prev,
            dishes: [...prev.dishes, newDish]
          }));
        }}
        className="bg-white hover:bg-green-400 border border-green-200 text-green-700 px-2 py-1 rounded-lg transition-colors text-sm"
      >
        {suggestion}
      </button>
    ))}
  </div>
              </div>
            </div>
            <div className="mt-6 flex flex-col">
  <button className="w-[40%] bg-green-600 text-white px-4 py-2 rounded mb-4 text-center">
    Enregistrer
  </button>
  <button className="w-[40%] bg-gray-200 text-gray-700 px-4 py-2 rounded text-center border mr-[2000px]">
    Annuler
  </button>
</div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default MenuCreation; 