import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

const LoginRestaurant = () => {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { loginUser } = useAppContext();
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('Tentative de connexion avec :', { email, motDePasse });

      // 1. Authentification
      const authResponse = await axios.post(`${apiUrl}/api/restaurant/login`, {
        email,
        motDePasse,
      });

      console.log('Réponse Authentification:', authResponse.data);

      const token = authResponse.data.token;

      // 2. Récupération des données utilisateur
      const userResponse = await axios.get(`${apiUrl}/api/restaurant/commercant/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Données utilisateur récupérées:', userResponse.data);

      // 3. Récupération des données du restaurant
      let restaurantData = {};
      if (userResponse.data.restaurantId) {
        console.log('ID du restaurant:', userResponse.data.restaurantId);

        const restaurantResponse = await axios.get(`${apiUrl}/api/restaurant/${userResponse.data.restaurantId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log('Données du restaurant récupérées:', restaurantResponse.data);
        restaurantData = restaurantResponse.data;
      }

      // 4. Mise à jour du contexte
      const userData = {
        ...userResponse.data,
        token,
        restaurant: restaurantData,
      };

      loginUser(userData);
      navigate('/homer');
    } catch (error) {
      console.error('Erreur lors du processus de connexion:', error);
      setError(
        error.response?.data?.message || 'Erreur de connexion. Veuillez réessayer.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-gray-100"
      style={{
        backgroundImage: `url('${apiUrl}/assets/bg.png')`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">Se connecter</h2>

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
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded-lg focus:outline-none ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-yellow-500 text-white hover:bg-yellow-600'
            }`}
          >
            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Vous n'avez pas de compte ?{' '}
            <Link to="/registeresto" className="text-yellow-600 hover:underline font-medium">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginRestaurant;