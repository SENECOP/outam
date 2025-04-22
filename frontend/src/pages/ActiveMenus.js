import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import { useParams, Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from "../context/AppContext";
const ActiveMenus = () => {
  // const { restaurantId } = useParams();
  const [menus, setMenus] = useState([]);
  const [erreur, setErreur] = useState(null);
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
        const res = await axios.get(`https://outam.onrender.com/api/restaurant/${restaurantId}/menus/actives-une-fois`);
        setMenus(res.data);
      } catch (err) {
        console.error('Erreur lors du chargement des menus actifs', err);
        setErreur("Impossible de charger les menus actifs");
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, [restaurantId]);

  if (loading) return <div className="text-center text-gray-500">Chargement des menus...</div>;
  if (erreur) return <div className="text-center text-red-500">{erreur}</div>;

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
                <Link to={`/gerermenu/${id}`} className="font-medium text-blue-600 px-3 py-2 rounded-lg bg-blue-50">
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

            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
    
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Menus Actifs</h2>

      {menus.length === 0 ? (
        <p className="text-center text-gray-500">Aucun menu actif pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menus.map((menu) => (
            <div key={menu._id} className="bg-white shadow-md rounded-xl p-4">
              <h3 className="text-xl font-semibold mb-2">{menu.name}</h3>
              <p className="text-sm text-gray-500 mb-3">Jour : {menu.day}</p>

              <ul className="space-y-2">
                {menu.dishes.map((dish, index) => (
                  <li key={index} className="border p-2 rounded-md">
                    <div className="flex justify-between">
                      <span className="font-medium">{dish.title}</span>
                      <span className="text-sm text-gray-700">{dish.price.toFixed(2)} €</span>
                    </div>
                    <p className="text-sm text-gray-600">{dish.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
          </div>
        </main>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default ActiveMenus;
