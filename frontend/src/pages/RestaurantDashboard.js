import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import EditMenuItemForm from '../components/EditMenuItemForm';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from "../components/DashboardLayout";


export default function RestaurantDashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { id } = useParams();
  const [activeMenu, setActiveMenu] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});
  const [editForm, setEditForm] = useState(null);
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const { currentRestaurant } = useAppContext();
  const { restaurantId } = useParams();
  const navigate = useNavigate();

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

  // Fetch le menu actif
  const fetchActiveMenu = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://outam.onrender.com/api/restaurant/${id}/menus/active`
      );
      const data = await response.json();

      if (response.ok) {
        if (data.menu) {
          setActiveMenu(data.menu);
          setMenuItems(data.menu.dishes || []);
        } else {
          setActiveMenu(null);
          setMenuItems([]);
        }
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
    fetchActiveMenu();
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
      navigate('/restaurants');
    }
  };

  return (
    <DashboardLayout>
    <div className="flex h-screen bg-gray-100">
      {/* <Sidebar isSidebarOpen={isSidebarOpen} /> */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <Header toggleSidebar={toggleSidebar} /> */}
        <main className="flex-1 overflow-y-auto p-4 ml-1">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full mr-4 shadow-md">
                <BookOpen size={24} className="text-blue-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">
                {activeMenu ? activeMenu.name : 'Menu du restaurant'}
                {activeMenu && (
                  <span className="ml-2 text-sm font-normal text-green-600">
                    (Menu actif)
                  </span>
                )}
              </h1>
            </div>

            <nav className="bg-white shadow-sm rounded-lg mb-6 p-4">
              <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0">
                <button className="font-medium text-blue-600 px-3 py-2 rounded-lg bg-blue-50">
                  Menu actif
                </button>
                <Link
                  to={`/gerermenu/${id}`}
                  className="text-gray-600 hover:text-gray-800 px-3 py-2"
                >
                  Gérer menu
                </Link>

                <Link
                  to={`/restaurant/${currentRestaurant?._id}/menu/create`}
                  onClick={handleQRCodeClick}
                  className="text-gray-600 hover:text-gray-800 px-3 py-2"
                >
                  Créer un menu
                </Link>
                <Link
                  to={`/addcategorie/${id}`}
                  onClick={handleQRCodeClick}
                  className="text-gray-600 hover:text-gray-800 px-3 py-2"
                >
                  Créer une catégorie
                </Link>
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
                <Link className="text-gray-600 hover:text-gray-800 px-3 py-2">
                                 Historique
                               </Link>
              </div>
            </nav>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              {menuItems.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  Aucun plat disponible dans le menu actif
                </div>
              ) : (
                menuItems.map((item) => {
                  const itemId = item._id?.$oid || item._id;
                  return (
                    <div key={itemId} className="border-b last:border-b-0">
                      <div className="p-4 flex items-start">
                        <img
                          src={
                            item.image?.startsWith('http')
                              ? item.image
                              : `http://localhost:5000${item.image}`
                          }
                          alt={item.title || 'Image non disponible'}
                          className="w-16 h-16 rounded-md object-cover mr-4"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/64';
                            e.target.onerror = null;
                          }}
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
                                      ? `${item.description
                                          .split(' ')
                                          .slice(0, 20)
                                          .join(' ')}...`
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
    </DashboardLayout>
  );
}