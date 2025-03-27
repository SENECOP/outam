import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Registerresto = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [nomRestaurant, setNomRestaurant] = useState("");
  const [imageUrl, setImageUrl] = useState(null); // Image de profil
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleImageChange = (e) => {
    setImageUrl(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("email", email);
    formData.append("motDePasse", motDePasse);
    formData.append("nomRestaurant", nomRestaurant);
    if (imageUrl) {
      formData.append("imageUrl", imageUrl); // Ajouter l'image si elle est sélectionnée
    }

    try {
      // Envoi des données à l'API pour l'enregistrement du commerçant
      const response = await axios.post("http://localhost:5000/api/commercant/registeresto", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Si l'enregistrement est réussi
      setSuccess("Inscription réussie ! Vous pouvez vous connecter.");
      setTimeout(() => navigate("/loginr"), 3000); // Rediriger après 3 secondes
    } catch (err) {
      setError("Erreur lors de l'inscription. Veuillez réessayer.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-semibold text-center mb-6">Inscription Commerçant - Restaurant</h1>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      {success && <div className="text-green-500 text-center mb-4">{success}</div>}

      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        {/* Mot de passe */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
          <input
            type="password"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        {/* Nom du restaurant */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nom du Restaurant</label>
          <input
            type="text"
            value={nomRestaurant}
            onChange={(e) => setNomRestaurant(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        {/* Image de profil */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Image de Profil (facultatif)</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        {/* Bouton de soumission */}
        <button
          type="submit"
          className="w-full py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700"
        >
          S'inscrire
        </button>
      </form>
    </div>
  );
};

export default Registerresto;
