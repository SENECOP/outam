import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft, Edit, Trash2, Plus } from 'lucide-react';

const RestaurantDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAppContext();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const response = await axios.get(
          `https://outam.onrender.com/api/restaurants/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setRestaurant(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [id, user.token]);

  const handleDeleteItem = async (itemId) => {
    try {
      await axios.delete(
        `https://outam.onrender.com/api/restaurants/${id}/menu/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      // Rafraîchir les données
      const updated = await axios.get(
        `https://outam.onrender.com/api/restaurants/${id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setRestaurant(updated.data);
    } catch (err) {
      setError('Erreur lors de la suppression');
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
      <div className="p-4 bg-red-100 text-red-700 rounded-lg max-w-md mx-auto mt-8">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              {restaurant?.name}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <img
              src={restaurant?.commercant?.photoDeProfil}
              alt="Profil"
              className="h-10 w-10 rounded-full"
            />
            <span className="text-gray-700">
              {restaurant?.commercant?.name}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Infos générales */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Informations du restaurant
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Nom:</p>
              <p className="font-medium">{restaurant?.name}</p>
            </div>
            <div>
              <p className="text-gray-600">Propriétaire:</p>
              <p className="font-medium">{restaurant?.commercant?.name}</p>
            </div>
            <div>
              <p className="text-gray-600">Email:</p>
              <p className="font-medium">{restaurant?.commercant?.email}</p>
            </div>
            <div>
              <p className="text-gray-600">Date de création:</p>
              <p className="font-medium">
                {new Date(restaurant?.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Menu</h2>
            <Link
              to={`/restaurants/${id}/menu/add`}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un plat
            </Link>
          </div>

          {restaurant?.menu?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun plat dans le menu pour le moment
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurant?.menu?.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg">{item.title}</h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          item.available
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.available ? 'Disponible' : 'Indisponible'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.category}
                    </p>
                    <p className="text-gray-600 mt-2">{item.description}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-gray-700">
                        Quantité: {item.quantity}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            navigate(`/restaurants/${id}/menu/${item.id}/edit`)
                          }
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RestaurantDetailsPage;
