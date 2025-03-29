import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import EditMenuItemForm from '../components/EditMenuItemForm';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

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
      const response = await fetch(
        `http://localhost:5000/api/restaurant/${id}/daily-menu`
      );
      const data = await response.json();

      if (response.ok && data.dailyMenus) {
        // Filtre les menus pour le jour actuel
        const today = new Date()
          .toLocaleDateString('fr-FR', { weekday: 'long' })
          .toLowerCase();
        const todayMenu = data.dailyMenus.filter(
          (menu) => menu.day.toLowerCase() === today && menu.isActive
        );
        setMenuItems(todayMenu.length > 0 ? todayMenu[0].dishes : []);
      } else {
        setError(data.message || 'Erreur lors du chargement du menu');
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
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
      alert('Aucun restaurant sélectionné');
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
              <h1 className="text-2xl font-bold text-gray-800">
                Menu du restaurant
              </h1>
            </div>

            <nav className="bg-white shadow-sm rounded-lg mb-6 p-4">
              <div className="flex space-x-6">
                <button className="font-medium text-blue-600 px-3 py-2 rounded-lg bg-blue-50">
                  Menu actuel
                </button>
                <Link
                  to={`/gerermenu/${id}`}
                  className="text-gray-600 hover:text-gray-800 px-3 py-2"
                >
                  Gerer menu
                </Link>

                <button className="text-gray-600 hover:text-gray-800 px-3 py-2">
                  Créer un menu
                </button>
                <Link
                  to={
                    currentRestaurant
                      ? `/restaurants/${currentRestaurant._id}/qrcode`
                      : '#'
                  }
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
              {menuItems.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  Aucun plat disponible pour aujourd'hui
                </div>
              ) : (
                menuItems.map((item) => {
                  const itemId = item._id.$oid || item._id;
                  return (
                    <div key={itemId} className="border-b last:border-b-0">
                      <div className="p-4 flex items-start">
                        <img
                          src={item.image || 'https://via.placeholder.com/64'} // Fallback pour l'image
                          alt={item.title || 'Image non disponible'} // Alt pour l'image
                          className="w-16 h-16 rounded-md object-cover mr-4"
                        />

                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h1 className="font-semibold text-gray-800">
                                {item.title || 'Titre non disponible'}
                                <span className="text-blue-600">
                                  (
                                  {item.price
                                    ? `${item.price} FCFA`
                                    : 'Prix non disponible'}
                                  )
                                </span>
                              </h1>
                              <p className="text-green-500">
                                {item.category || 'Catégorie non définie'}
                              </p>

                              <p className="text-sm text-gray-600 mt-1">
                                {expandedItems[itemId] ? (
                                  <>
                                    {item.description ||
                                      'Aucune description disponible'}
                                    <button
                                      className="text-blue-500 ml-2 text-sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleDescription(itemId);
                                      }}
                                    >
                                      Voir moins
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    {item.description &&
                                    item.description.split(' ').length > 20
                                      ? `${item.description.split(' ').slice(0, 20).join(' ')}...`
                                      : item.description ||
                                        'Aucune description disponible'}
                                    {item.description &&
                                      item.description.split(' ').length >
                                        20 && (
                                        <button
                                          className="text-blue-500 ml-2 text-sm"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleDescription(itemId);
                                          }}
                                        >
                                          Voir plus
                                        </button>
                                      )}
                                  </>
                                )}
                              </p>
                            </div>
                            <button
                              className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md text-sm text-gray-700 ml-4"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleEditForm(itemId);
                              }}
                            >
                              {editForm === itemId ? 'Fermer' : 'Modifier'}
                            </button>
                          </div>

                          {editForm === itemId && (
                            <div className="mt-4">
                              <EditMenuItemForm
                                item={{ ...item, restaurantId: id }}
                                onClose={handleEditSuccess}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
