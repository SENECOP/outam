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
      image: [] 
    }]);
  };

  const handleDishChange = (index, field, value) => {
    const newDishes = [...dishes];
    newDishes[index][field] = value;
    setDishes(newDishes);
  };

  const handleMultipleImageUpload = (index, files) => {
    const selectedFiles = Array.from(files).slice(0, 4); // max 4 à la fois
    const newDishes = [...dishes];

    // Ajoute les nouvelles image aux existantes, sans dépasser 4 image au total
    const existingimage = newDishes[index].image || [];
    const combinedimage = existingimage.concat(selectedFiles).slice(0, 4); // max 4 image

    newDishes[index].image = combinedimage;
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
        
        // Ajout des image
        dish.image.forEach((image, i) => {
          formData.append(`dishes[${index}][image][${i}]`, image);
        });
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

  const resetForm = () => {
    const confirmReset = window.confirm("Voulez-vous vraiment annuler ? Les informations saisies seront perdues.");
    if (confirmReset) {
      setMenuTitle("");
      setDishes([]);
    }
  };

  const resetForme = () => {
    setMenuTitle("");
    setDishes([]);
  };

  return (
    <DashboardLayout>
      <div className="flex h-screen bg-gray-100">
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
                <Link to={`/restaurants/${restaurantId}/qrcode`} className="text-gray-600 hover:text-gray-800 px-3 py-2">
                  QR Code
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
                          multiple
                          accept="image/*"
                          onChange={(e) => handleMultipleImageUpload(index, e.target.files)}
                          className="w-full p-2 border rounded mb-2"
                        />

                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {dish.image.map((img, i) => (
                            <div key={i} className="relative">
                              <img
                                src={URL.createObjectURL(img)}
                                alt={`Image ${i}`}
                                className="w-32 h-32 object-cover rounded"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedDishes = [...dishes];
                                  updatedDishes[index].image.splice(i, 1);
                                  setDishes(updatedDishes);
                                }}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div className="mt-6 flex flex-col md:flex-row gap-4">
                      <button type="button" onClick={addDish} className="w-full md:w-1/2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">+ Ajouter un plat</button>
                      <button type="button" onClick={resetForme} className="w-full md:w-[40%] bg-gray-200 text-gray-700 px-4 py-2 rounded border hover:bg-gray-300">Fermer</button>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-4">
                    <h3 className="text-green-800 font-medium mb-4">Suggestions de plats</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-2 gap-2">
                      {suggestedDishes.map((suggestion) => (
                        <button key={suggestion._id} onClick={() => {
                          const newDish = {
                            title: suggestion.title,
                            description: suggestion.description || "",
                            price: suggestion.price || "",
                            category: suggestion.category || "plat",
                            image: []
                          };
                          setDishes([...dishes, newDish]);
                        }} className="bg-white hover:bg-green-400 border border-green-200 text-green-700 px-2 py-1 rounded-lg text-sm">
                          {suggestion.title}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col md:flex-row gap-4">
                  <button type="submit" disabled={isLoading} className="w-full md:w-[40%] bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-green-400">
                    {isLoading ? "Enregistrement..." : "Enregistrer"}
                  </button>
                  <button type="button" onClick={resetForm} className="w-full md:w-[40%] bg-gray-200 text-gray-700 px-4 py-2 rounded border hover:bg-gray-300">
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
