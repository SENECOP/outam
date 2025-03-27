import { useState } from "react";
import axios from "axios";

const RegisterRestaurant = () => {
  const [restaurantName, setRestaurantName] = useState("");
  const [commercantName, setCommercantName] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [photoDeProfil, setPhotoDeProfil] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/restaurant/register", {
        restaurantName,
        commercantName,
        email,
        motDePasse,
        photoDeProfil,
      });
      window.location.href = "/loginres"; // Rediriger après l'enregistrement
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors de l'inscription");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">Créer un compte</h2>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="restaurantName">
              Nom du restaurant
            </label>
            <input
              type="text"
              id="restaurantName"
              name="restaurantName"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="commercantName">
              Nom du commerçant
            </label>
            <input
              type="text"
              id="commercantName"
              name="commercantName"
              value={commercantName}
              onChange={(e) => setCommercantName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

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

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="photoDeProfil">
              Photo de profil
            </label>
            <input
              type="text"
              id="photoDeProfil"
              name="photoDeProfil"
              value={photoDeProfil}
              onChange={(e) => setPhotoDeProfil(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg focus:outline-none hover:bg-blue-600"
          >
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterRestaurant;
