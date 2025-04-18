import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
// import { UserCircle } from "phosphor-react"; // Exemple avec Phosphor Icons
// OU
import { FaUser } from "react-icons/fa"; // Exemple avec Font Awesome
// OU
import { FiUser } from "react-icons/fi"; // Exemple avec Feather Icons

const ProfilRestaurant = () => {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [typesCuisine, setTypesCuisine] = useState([]);
  const [image, setImage] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  const cuisinesDisponibles = ['Italien', 'Marocain', 'Asiatique', 'Fast Food', 'Végétarien'];

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const token = localStorage.getItem('token'); // ou cookie si tu préfères
        const response = await axios.get(`https://outam.onrender.com/api/restaurant/${restaurantId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        setRestaurant(data);
        setNom(data.nom || '');
        setDescription(data.description || '');
        setSlug(data.slug || '');
        setTypesCuisine(data.typesCuisine || []);
      } catch (error) {
        console.error('Erreur lors de la récupération du restaurant:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [restaurantId]);

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  if (loading) return <div className="text-center mt-10">Chargement...</div>;

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
              <FaUser size={24} className="text-blue-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">
                {activeMenu ? activeMenu.name : 'Compte et profils'}
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
               Modifier le profil
                </button>
                <Link
                //   to={`/gerermenu/${id}`}
                  className="text-gray-600 hover:text-gray-800 px-3 py-2"
                >
                Securite
                </Link>

                <Link
                //   to={`/restaurant/${currentRestaurant?._id}/menu/create`}
                //   onClick={handleQRCodeClick}
                  className="text-gray-600 hover:text-gray-800 px-3 py-2"
                >
                 Notifications
                </Link>
                <Link
                //   to={`/addcategorie/${id}`}
                //   onClick={handleQRCodeClick}
                  className="text-gray-600 hover:text-gray-800 px-3 py-2"
                >
                
                </Link>
                <Link
                //   to={
                //     currentRestaurant
                //       ? `/restaurants/${currentRestaurant._id}/qrcode`
                //       : '#'
                //   }
                //   onClick={handleQRCodeClick}
                  className="text-gray-600 hover:text-gray-800 px-3 py-2"
                >
               
                </Link>
                <Link className="text-gray-600 hover:text-gray-800 px-3 py-2">
                                 Historique
                               </Link>
              </div>
            </nav>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl ml-2 mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Information général</h2>
      <p className="text-sm text-gray-500 mb-4">Dans cet espace, vous pouvez créer un nouveau menu</p>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Nom du restaurant</label>
        <input
          type="text"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Slug / URL</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Description / Bio</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      {/* <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Types de cuisine</label>
        <select
          multiple
          value={typesCuisine}
          onChange={(e) => setTypesCuisine([...e.target.selectedOptions].map((opt) => opt.value))}
          className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500"
        >
          {cuisinesDisponibles.map((cuisine) => (
            <option key={cuisine} value={cuisine}>
              {cuisine}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Image de profil / Couverture</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {image && <p className="mt-2 text-sm text-gray-600">Fichier sélectionné : {image.name}</p>}
      </div>

      <button className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600">
        Enregistrer
      </button> */}
    </div>
            </div>
          </div>
        </main>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default ProfilRestaurant;
