import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import DashboardLayout from "../components/DashboardLayout";
import EditMenuItemForm from '../components/EditMenuItemForm';
import { useAppContext } from '../context/AppContext';

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
  const [selectedCategory, setSelectedCategory] = useState('');
  const [availableCategories, setAvailableCategories] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;

  const [newDish, setNewDish] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    image: null,
  });

  const { currentRestaurant } = useAppContext();
  const restaurantId = currentRestaurant ? currentRestaurant._id : null;
  const navigate = useNavigate();

  const toggleDescription = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const toggleEditForm = (itemId) => {
    setEditForm((prev) => (prev === itemId ? null : itemId));
  };

  const fetchActiveMenu = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/restaurant/${id}/menus/active`);
      const data = await response.json();
      if (response.ok) {
        setActiveMenu(data.menu || null);
        setMenuItems(data.menu?.dishes || []);
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

  useEffect(() => {
    const categories = [...new Set(menuItems.map((item) => item.category))];
    setAvailableCategories(categories);
  }, [menuItems]);

  const handleEditSuccess = () => {
    setShouldRefresh((prev) => !prev);
    setEditForm(null);
  };

  const handleAddDish = async (e) => {
    e.preventDefault();
    if (!restaurantId || !activeMenu?._id) return;

    const formData = new FormData();
    formData.append('title', newDish.title);
    formData.append('description', newDish.description);
    formData.append('price', newDish.price);
    formData.append('category', newDish.category);
    formData.append('menuId', activeMenu._id);
    if (newDish.image) {
      formData.append('image', newDish.image);
    }

    try {
      const res = await fetch(`${apiUrl}/api/dish/${restaurantId}`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Erreur lors de l’ajout');

      const data = await res.json();
      setShouldRefresh((prev) => !prev);
      setNewDish({ title: '', description: '', price: '', category: '', image: null });
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'ajout du plat");
    }
  };

  const handleQRCodeClick = (e) => {
    if (!currentRestaurant) {
      e.preventDefault();
      alert('Aucun restaurant sélectionné');
      navigate('/restaurants');
    }
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

  return (
    <DashboardLayout>
      <div className="flex h-screen bg-gray-100">
        <div className="flex-1 flex flex-col overflow-hidden">
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
                  <Link to={`/gerermenu/${id}`} className="text-gray-600 hover:text-gray-800 px-3 py-2">Gérer menu</Link>
                  <Link to={`/restaurant/${currentRestaurant?._id}/menu/create`} onClick={handleQRCodeClick} className="text-gray-600 hover:text-gray-800 px-3 py-2">Créer un menu</Link>
                  <Link to={`/addcategorie/${id}`} onClick={handleQRCodeClick} className="text-gray-600 hover:text-gray-800 px-3 py-2">Créer une catégorie</Link>
                  <Link to={currentRestaurant ? `/restaurants/${currentRestaurant._id}/qrcode` : '#'} onClick={handleQRCodeClick} className="text-gray-600 hover:text-gray-800 px-3 py-2">QR Code</Link>
                  <Link to={`/restaurant/${restaurantId}/menus-actifs`} className="text-gray-600 hover:text-gray-800 px-3 py-2">Historique</Link>
                </div>
              </nav>

              {/* Filtres + Ajouter un plat */}
              <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <div className="flex items-center space-x-2 mb-2 md:mb-0">
                  <label htmlFor="categoryFilter" className="text-sm font-medium text-gray-700">Filtres :</label>
                  <select
                    id="categoryFilter"
                    className="bg-green-500 rounded-md px-3 py-1 text-sm"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">Catégories</option>
                    {availableCategories.map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => setShowAddForm((prev) => !prev)}
                  className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-md"
                >
                  {showAddForm ? 'Annuler' : '+ Ajouter un plat'}
                </button>
              </div>

              {/* Formulaire d'ajout de plat */}
              {showAddForm && (
                <form onSubmit={handleAddDish} className="bg-white p-4 rounded shadow mb-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Titre du plat" required
                      value={newDish.title}
                      onChange={(e) => setNewDish({ ...newDish, title: e.target.value })}
                      className="border px-3 py-2 rounded"
                    />
                    <input type="number" placeholder="Prix (FCFA)" required
                      value={newDish.price}
                      onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                      className="border px-3 py-2 rounded"
                    />
                    <input type="text" placeholder="Catégorie"
                      value={newDish.category}
                      onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
                      className="border px-3 py-2 rounded"
                    />
                    <input type="file" accept="image/*"
                      onChange={(e) => setNewDish({ ...newDish, image: e.target.files[0] })}
                      className="border px-3 py-2 rounded"
                    />
                  </div>
                  <textarea placeholder="Description" rows={3}
                    value={newDish.description}
                    onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                    className="border px-3 py-2 rounded w-full"
                  />
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                    Ajouter le plat
                  </button>
                </form>
              )}

              {/* Liste des plats */}
              <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                {(selectedCategory
                  ? menuItems.filter(item => item.category === selectedCategory)
                  : menuItems
                ).map((item) => {
                  const itemId = item._id?.$oid || item._id;
                  return (
                    <div key={itemId} className="border-b last:border-b-0">
                      <div className="p-4 flex items-start">
                        <img
                          src={
                            item.image?.startsWith('http')
                              ? item.image
                              : `${apiUrl}${item.image}`
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
                                <span className="text-blue-600 ml-2">
                                  {item.price ? `${item.price} FCFA` : 'Prix non disponible'}
                                </span>
                              </h1>
                              <p className="text-green-500">
                                {item.category || 'Catégorie non définie'}
                              </p>

                              <p className="text-sm text-gray-600 mt-1">
                                {expandedItems[itemId] ? (
                                  <>
                                    {item.description || 'Aucune description disponible'}
                                    <button className="text-blue-500 ml-2 text-sm" onClick={() => toggleDescription(itemId)}>Voir moins</button>
                                  </>
                                ) : (
                                  <>
                                    {(item.description?.split(' ').length > 20
                                      ? item.description.split(' ').slice(0, 20).join(' ') + '...'
                                      : item.description || 'Aucune description disponible')}
                                    {(item.description?.split(' ').length > 20) && (
                                      <button className="text-blue-500 ml-2 text-sm" onClick={() => toggleDescription(itemId)}>Voir plus</button>
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
                })}
              </div>
            </div>
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
}
