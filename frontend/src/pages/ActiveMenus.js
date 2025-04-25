import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { useAppContext } from "../context/AppContext";

const ActiveMenus = () => {
  const [menus, setMenus] = useState([]);
  const [erreur, setErreur] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const { currentRestaurant } = useAppContext();
  const navigate = useNavigate();
  const restaurantId = currentRestaurant ? currentRestaurant._id : null;
  const apiUrl = process.env.REACT_APP_API_URL;
  const handleQRCodeClick = (e) => {
    if (!currentRestaurant) {
      e.preventDefault();
      alert('Aucun restaurant sélectionné');
      navigate('/restaurants');
    }
  };

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/restaurant/${restaurantId}/menus/actives-une-fois`);
        setMenus(res.data);
      } catch (err) {
        console.error('Erreur lors du chargement des menus actifs', err);
        setErreur("Impossible de charger les menus actifs");
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchMenus();
    }
  }, [restaurantId]);

  if (loading) return <div className="text-center text-gray-500">Chargement des menus...</div>;
  if (erreur) return <div className="text-center text-red-500">{erreur}</div>;

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
                  <Link to={`/restaurant/${restaurantId}/menu/create`} className="text-gray-600 hover:text-gray-800 px-3 py-2">
                    Créer un menu
                  </Link>
                  <Link
                    to={`/addcategorie/${id}`}
                    onClick={handleQRCodeClick}
                    className="text-gray-600 hover:text-gray-800 px-3 py-2"
                  >
                    Créer une catégorie
                  </Link>
                  <Link to={`/restaurants/${restaurantId}/qrcode`} className="text-gray-600 hover:text-gray-800 px-3 py-2">
                    QR Code
                  </Link>
                  <Link to={`/restaurant/${restaurantId}/menus-actifs`} className="font-medium text-blue-600 px-3 py-2 rounded-lg bg-blue-50">
                    Historique
                  </Link>
                </div>
              </nav>

              <div className="bg-white shadow-sm rounded-lg overflow-hidden p-6">
                <h3 className="font-semibold text-lg mb-1">Historique</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Dans cet espace, vous pouvez voir l'historique
                </p>

                {menus.length === 0 ? (
                  <p className="text-center text-gray-500">Aucun menu actif pour le moment.</p>
                ) : (
                  <div className="space-y-6">
                    {menus.map((menu) => (
                      <div key={menu._id} className="border-b pb-4">
                        <h3 className="font-bold text-base">Menu {menu.day}</h3>
                        <div className="flex flex-wrap text-sm text-gray-600 mt-1">
  <span className="mx-0">
    Activé le : {new Date(menu.createdAt).toLocaleDateString('fr-FR')} {new Date(menu.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
  </span>
  <span className="mx-12">
    Catégories : {new Set(menu.dishes.map(d => d.category)).size.toString().padStart(2, '0')}
  </span>
  <span className="mx-12">
    Plats : {menu.dishes.length.toString().padStart(2, '0')}
  </span>
</div>

                      </div>
                    ))}

                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ActiveMenus;
