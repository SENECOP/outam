import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from "../context/AppContext";

export default function GererMenu({ user }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const navigate = useNavigate();
  const { currentRestaurant } = useAppContext();
  const restaurantId = currentRestaurant ? currentRestaurant._id : null;

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/restaurant/${id}`
        );
        if (!response.ok)
          throw new Error('Erreur lors du chargement des données');

        const data = await response.json();
        setRestaurant(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id, shouldRefresh]);

  const toggleMenuStatus = async (menuId, currentStatus) => {
    if (isToggling) return;
    setIsToggling(true);
    
    try {
      const res = await fetch(`http://localhost:5000/api/restaurant/${id}/menus/${menuId}/status`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
  
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || "Échec de la mise à jour");
      }
  
      setShouldRefresh(prev => !prev);
    } catch (err) {
      console.error("ToggleMenuStatus Error:", err);
      setError(err.message);
    } finally {
      setIsToggling(false);
    }
  };

  const handleRedirect = () => {
    if (!user || !user.restaurantId) {
      console.error("Restaurant ID manquant ou `user` non défini");
      return;
    }
    navigate(`/restaurant/${user.restaurantId}`);
  };

  if (loading) return <p className="text-center text-gray-500">Chargement...</p>;
  if (error) return <p className="text-center text-red-500">Erreur : {error}</p>;
  if (!restaurant) return <p className="text-center text-gray-500">Aucune donnée disponible</p>;
  
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
              <h1 className="text-2xl font-bold text-gray-800">
                Menu du restaurant
              </h1>
            </div>

            <nav className="bg-white shadow-sm rounded-lg mb-6 p-4">
              <div className="flex space-x-6">
                <Link 
                  to={`/restaurant/${restaurantId}`}
                  className="text-gray-600 hover:text-gray-800 px-3 py-2"
                >
                  Menu actuel
                </Link>            
                <Link to={`/gerermenu/${id}`} className="font-medium text-blue-600 px-3 py-2 rounded-lg bg-blue-50">
                  Gérer menu
                </Link>
                <Link to={`/restaurant/${restaurantId}/menu/create`} className="text-gray-600 hover:text-gray-800 px-3 py-2">
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

            <div className="bg-white p-6 rounded-lg shadow-md">
              {restaurant.menus?.map((menu) => (
                <div key={menu._id} className="border-b py-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold">Menu {menu.day}</h2>
                    <div className="flex items-center gap-32">
                      <p className="text-sm text-gray-500">
                        Créé : {new Date(menu.createdAt).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Catégories :{' '}
                        {
                          [...new Set(menu.dishes.map((dish) => dish.category))]
                            .length
                        }
                      </p>
                      <p className="text-sm text-gray-500">
                        Plats : {menu.dishes?.length || 0}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">Activé</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={menu.isActive}
                        onChange={() => toggleMenuStatus(menu._id, menu.isActive)}
                        disabled={isToggling}
                        className="sr-only peer"
                      />
                      <div className={`w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer ${menu.isActive ? 'peer-checked:bg-green-500' : ''} ${isToggling ? 'opacity-50 cursor-not-allowed' : ''} peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                    </label>
                    <span className="text-sm text-gray-500 ml-2">
                      Désactivé
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}