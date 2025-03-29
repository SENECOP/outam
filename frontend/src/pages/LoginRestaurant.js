import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const LoginRestaurant = () => {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { loginUser } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 1. Authentification
      const authResponse = await axios.post(
        'http://localhost:5000/api/restaurant/login',
        { email, motDePasse }
      );

      const token = authResponse.data.token;

      // 2. Récupération des données utilisateur
      const userResponse = await axios.get(
        'http://localhost:5000/api/restaurant/commercant/me',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 3. Récupération des données du restaurant si elles ne sont pas incluses
      let restaurantData = {};
      if (userResponse.data.restaurantId) {
        const restaurantResponse = await axios.get(
          `http://localhost:5000/api/restaurant/${userResponse.data.restaurantId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        restaurantData = restaurantResponse.data;
      }

      // 4. Préparation des données pour le contexte
      const userData = {
        ...userResponse.data,
        token,
        restaurant: restaurantData, // Ajout des données complètes du restaurant
      };

      // 5. Mise à jour du contexte
      loginUser(userData);

      // 6. Redirection
      navigate('/homer');
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setError(
        error.response?.data?.message ||
          'Erreur de connexion. Veuillez réessayer.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Se connecter
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded-lg focus:outline-none ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginRestaurant;
