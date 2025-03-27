import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext"; // Import du contexte

const LoginRestaurant = () => {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [error, setError] = useState("");
  const { loginUser } = useAppContext(); // Utilisation du contexte pour se connecter
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/restaurant/login", {
        email,
        motDePasse,
      });

      // Récupérer le token depuis la réponse
      const token = response.data.token;

      // Utiliser le token pour récupérer les infos du commerçant connecté
      const userResponse = await axios.get("http://localhost:5000/api/restaurant/commercant/me", {
        headers: {
          Authorization: `Bearer ${token}`, // Ajouter le token dans l'en-tête
        }
      });

      // Sauvegarder l'utilisateur et ses informations dans le contexte
      const userData = {
        email: userResponse.data.email,
        name: userResponse.data.name,
        photoDeProfil: userResponse.data.photoDeProfil,
        token: token,
        restaurantId: userResponse.data.restaurantId, // Assurez-vous que cette donnée existe
      };

      loginUser(userData); // Mettre à jour le contexte avec les infos du commerçant

      // Rediriger après le succès
      navigate("/homer");
    } catch (error) {
      setError(error.response?.data?.message || "Erreur de connexion");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">Se connecter</h2>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" htmlFor="motDePasse">
              Mot de passe
            </label>
            <input
              type="password"
              id="motDePasse"
              name="motDePasse"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg focus:outline-none hover:bg-blue-600"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginRestaurant;
