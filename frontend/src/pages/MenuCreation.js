import { useState, useEffect } from 'react';
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import DashboardLayout from '../components/DashboardLayout';
import { BookOpen } from 'lucide-react';
function MenuCreation() {
  const { currentRestaurant } = useAppContext();
  const restaurantId = currentRestaurant ? currentRestaurant._id : null;
  const [menuTitle, setMenuTitle] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL;

  const { categories } = useAppContext(); // Utilisation du context pour accéder aux catégories
  const [selectedCategory, setSelectedCategory] = useState(categories[0] || "");
  const { id } = useParams();
  const handleQRCodeClick = (e) => {
    if (!currentRestaurant) {
      e.preventDefault();
      alert('Aucun restaurant sélectionné');
      navigate('/restaurants');
    }
  };
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const [dishes, setDishes] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedDishes, setSuggestedDishes] = useState([]);

  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const addDish = () => {
    setDishes([...dishes, { 
      title: "", 
      description: "", 
      price: "", 
      category: "Lunch",
      image: null 
    }]);
  };

  const handleDishChange = (index, field, value) => {
    const newDishes = [...dishes];
    newDishes[index][field] = value;
    setDishes(newDishes);
  };

  const handleImageUpload = (index, file) => {
    const newDishes = [...dishes];
    newDishes[index].image = file;
    setDishes(newDishes);
  };

  const removeDish = (index) => {
    const newDishes = [...dishes];
    newDishes.splice(index, 1);
    setDishes(newDishes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", menuTitle);
      formData.append("day", "lundi");
      
      dishes.forEach((dish, index) => {
        formData.append(`dishes[${index}][title]`, dish.title);
        formData.append(`dishes[${index}][description]`, dish.description);
        formData.append(`dishes[${index}][price]`, dish.price);
        formData.append(`dishes[${index}][category]`, dish.category);
        if (dish.image) {
          formData.append(`dishes[${index}][image]`, dish.image);
        }
      });

      await axios.post(
        `${apiUrl}/api/restaurant/${restaurantId}/menus`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Menu créé avec succès");
      navigate(`/gerermenu/${restaurantId}`);
    } catch (error) {
      console.error("Erreur lors de la création du menu", error);
      alert("Erreur lors de la création du menu");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (restaurantId) {
      const fetchDishes = async () => {
        try {
          const response = await axios.get(`${apiUrl}/api/restaurant/${restaurantId}/dishes`);
          setSuggestedDishes(response.data);
        } catch (error) {
          console.error("Erreur lors de la récupération des plats suggérés", error);
        }
      };
      fetchDishes();
    }
  }, [restaurantId]);



  return (
    <DashboardLayout>
    <div className="flex h-screen bg-gray-100">
      {/* <Sidebar isSidebarOpen={isSidebarOpen} /> */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 ml-1">
          <div className="flex items-center mb-6">
                        <div className="bg-blue-100 p-3 rounded-full mr-4 shadow-md">
                          <BookOpen size={24} className="text-blue-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">
                          Menu du restaurant
                        </h1>
                      </div>
          <nav className="bg-white shadow-sm rounded-lg mb-6 p-4">
            <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0">
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
              <Link
                  to={`/addcategorie/${id}`}
                  onClick={handleQRCodeClick}
                  className="text-gray-600 hover:text-gray-800 px-3 py-2"
                >
                  Creer une categorie
                </Link>
              <Link to={`/restaurants/${restaurantId}/qrcode`} className="text-gray-600 hover:text-gray-800 px-3 py-2">
                QR Code
              </Link>
              <Link to={`/restaurant/${restaurantId}/menus-actifs`} className="text-gray-600 hover:text-gray-800 px-3 py-2">
  Historique
</Link>
            </div>
          </nav>
          
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
  <h2 className="text-xl font-semibold mb-2">Création de menu</h2>
  <p className="text-gray-600 mb-4">Dans cet espace, vous pouvez créer un nouveau menu</p>
  
  <form onSubmit={handleSubmit}>
    <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
      <input
        type="text"
        placeholder="Titre du menu"
        value={menuTitle}
        onChange={(e) => setMenuTitle(e.target.value)}
        className="p-2 border rounded w-full md:w-auto flex-grow"
        required
      />
      <button 
        type="button" 
        className="bg-gray-300 px-4 py-2 rounded w-full md:w-auto md:mr-[600px]"
        onClick={() => navigate(`/gerermenu/${restaurantId}`)}
      >
        Ignorer
      </button>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="flex flex-col space-y-4">
        {dishes.map((dish, index) => (
          <div key={index} className="mb-4 p-4 border rounded relative">
            <button
              type="button"
              onClick={() => removeDish(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              ×
            </button>

            <input
              type="text"
              placeholder="Nom du plat"
              value={dish.title}
              onChange={(e) => handleDishChange(index, "title", e.target.value)}
              className="w-full p-2 border rounded mb-2"
              required
            />

            <input
              type="number"
              placeholder="Prix du plat"
              value={dish.price}
              onChange={(e) => handleDishChange(index, "price", e.target.value)}
              className="w-full p-2 border rounded mb-2"
              required
            />

            <textarea
              placeholder="Description du plat"
              value={dish.description}
              onChange={(e) => handleDishChange(index, "description", e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />

            <select
              value={dish.category || ""}
              onChange={(e) => handleDishChange(index, "category", e.target.value)}
              className="w-full p-2 border rounded mb-2"
            >
              {categories.map((category, catIndex) => (
                <option key={catIndex} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <input
              type="file"
              onChange={(e) => handleImageUpload(index, e.target.files[0])}
              className="w-full p-2 border rounded mb-2"
              accept="image/*"
            />
            {dish.image && (
              <div className="mt-2">
                <img
                  src={URL.createObjectURL(dish.image)}
                  alt="Aperçu du plat"
                  className="w-32 h-32 object-cover rounded"
                />
              </div>
            )}
          </div>
        ))}
        <button 
          type="button"
          onClick={addDish} 
          className="w-full md:w-1/2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        > 
          + Ajouter un plat
        </button>
      </div>
      
      <div className="flex flex-col space-y-4">
        <h3 className="text-green-800 font-medium mb-4">Suggestions de plats</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-2 gap-2">
          {suggestedDishes.map((suggestion) => (
            <button 
              key={suggestion._id}
              onClick={() => {
                const newDish = {
                  title: suggestion.title,
                  description: suggestion.description || "",
                  price: suggestion.price || "",
                  category: suggestion.category || "plat",
                };
                setDishes([...dishes, newDish]);
              }}
              className="bg-white hover:bg-green-400 border border-green-200 text-green-700 px-2 py-1 rounded-lg transition-colors text-sm"
            >
              {suggestion.title}
            </button>
          ))}
        </div>
      </div>
    </div>

    <div className="mt-6 flex flex-col md:flex-row gap-4">
      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full md:w-[40%] bg-green-600 text-white px-4 py-2 rounded text-center hover:bg-green-700 disabled:bg-green-400"
      >
        {isLoading ? "Enregistrement..." : "Enregistrer"}
      </button>
      <button 
        type="button"
        onClick={() => navigate(`/gerermenu/${restaurantId}`)}
        className="w-full md:w-[40%] bg-gray-200 text-gray-700 px-4 py-2 rounded text-center border hover:bg-gray-300"
      >
        Annuler
      </button>
    </div>
  </form>
</div>
        </main>
      </div>
    </div>
    </DashboardLayout>
  );
}

export default MenuCreation;
