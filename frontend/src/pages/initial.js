import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import EditMenuItemForm from "../components/EditMenuItemForm";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";


export default function RestaurantDashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { id } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});
  const [editForm, setEditForm] = useState(null);
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const { currentRestaurant } = useAppContext();
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  console.log('Current Restaurant:', currentRestaurant); // Debug important
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const toggleDescription = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const toggleEditForm = (itemId) => {
    setEditForm((prev) => (prev === itemId ? null : itemId));
  };

  // Fetch les plats du menu en fonction du jour
  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://outam.onrender.com/api/restaurant/${id}/daily-menu`);
      const data = await response.json();

      if (response.ok && data.dailyMenus) {
        // Filtre les menus pour le jour actuel
        const today = new Date().toLocaleDateString("fr-FR", { weekday: "long" }).toLowerCase();
        const todayMenu = data.dailyMenus.filter(menu => menu.day.toLowerCase() === today && menu.isActive);
        setMenuItems(todayMenu.length > 0 ? todayMenu[0].dishes : []);
      } else {
        setError(data.message || "Erreur lors du chargement du menu");
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, [id, shouldRefresh]);

  const handleEditSuccess = () => {
    setShouldRefresh((prev) => !prev);
    setEditForm(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }
  const handleQRCodeClick = (e) => {
    if (!currentRestaurant) {
      e.preventDefault();
      alert("Aucun restaurant sélectionné");
      navigate('/restaurants'); // Redirige vers la page de sélection
    }
  };
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 ml-1">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full mr-4 shadow-md">
                <BookOpen size={24} className="text-blue-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Menu du restaurant</h1>
            </div>

            <nav className="bg-white shadow-sm rounded-lg mb-6 p-4">
              <div className="flex space-x-24">
                <button className="font-medium text-blue-600 px-3 py-2 rounded-lg bg-blue-50">
                  Menu actuel
                </button>
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
to={`/addcategorie/${id}`}      onClick={handleQRCodeClick}
      className="text-gray-600 hover:text-gray-800 px-3 py-2"
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
                <button className="text-gray-600 hover:text-gray-800 px-3 py-2">
                  Historique
                </button>
              </div>
            </nav>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
             
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
