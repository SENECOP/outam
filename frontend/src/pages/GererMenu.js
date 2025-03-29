import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

export default function GererMenu({ user }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const navigate = useNavigate();

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
  }, [id, shouldRefresh]); // Recharger après modification

  // ✅ Fonction pour activer/désactiver un menu
  const toggleMenuStatus = async (menuId, currentStatus) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/restaurant/${id}/menu/${menuId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isActive: !currentStatus }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur serveur:', errorData); // Log l'erreur du serveur pour plus de détails
        throw new Error(
          errorData.message || 'Erreur lors de la mise à jour du menu'
        );
      }

      // Rafraîchir les données sans rediriger
      setShouldRefresh((prev) => !prev);
    } catch (err) {
      setError('Impossible de mettre à jour le menu: ' + err.message);
    }
  };

  if (loading)
    return <p className="text-center text-gray-500">Chargement...</p>;
  if (error)
    return <p className="text-center text-red-500">Erreur : {error}</p>;
  if (!restaurant)
    return (
      <p className="text-center text-gray-500">Aucune donnée disponible</p>
    );

  const handleRedirect = () => {
    // Vérifiez d'abord si `user` et `user.restaurantId` sont définis
    if (!user || !user.restaurantId) {
      console.error('Restaurant ID manquant ou `user` non défini');
      return; // Ne pas effectuer la redirection si les données sont manquantes
    }

    // Si tout est valide, effectuer la redirection
    navigate(`/restaurant/${user.restaurantId}`);
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

            {/* Navigation */}
            <nav className="bg-white shadow-sm rounded-lg mb-6 p-4">
              <div className="flex space-x-6">
                <button
                  onClick={handleRedirect}
                  className="text-gray-600 hover:text-gray-800 px-3 py-2"
                >
                  Menu actuel
                </button>
                <Link
                  to={`/gerermenu/${id}`}
                  className="font-medium text-blue-600 px-3 py-2 rounded-lg bg-blue-50"
                >
                  Gérer menu
                </Link>
                <button className="text-gray-600 hover:text-gray-800 px-3 py-2">
                  Créer un menu
                </button>
                <Link
                  to="/qrcoderesto"
                  className="text-gray-600 hover:text-gray-800 px-3 py-2"
                >
                  QR Code
                </Link>
                <button className="text-gray-600 hover:text-gray-800 px-3 py-2">
                  Historique
                </button>
              </div>
            </nav>

            {/* Liste des menus */}
            <div className="bg-white p-6  rounded-lg shadow-md">
              {restaurant.menus?.map((menu) => (
                <div
                  key={menu._id}
                  className="border-b py-4 flex justify-between items-center"
                >
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

                  {/* ✅ Switch pour activer/désactiver */}
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">Activé</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={menu.isActive}
                        onChange={() =>
                          toggleMenuStatus(menu._id, menu.isActive)
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:bg-green-500 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
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
