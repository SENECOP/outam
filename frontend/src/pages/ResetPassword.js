import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPasswordPage = () => {
  const { token } = useParams(); // Récupérer le token depuis l'URL
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const response = await axios.post(
        `https://outam.onrender.com/api/commercant/reset-password/${token}`,
        { newPassword }
      );
      setMessage(response.data.message);
      setError('');

      // Rediriger vers la page de connexion après 3 secondes
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Erreur lors de la réinitialisation.'
      );
    }
  };

  return (
    <div className="relative h-screen w-screen flex items-center justify-center">
      {/* Image de fond */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/assets/bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>

      {/* Conteneur du formulaire */}
      <div className="relative bg-white p-8 rounded-lg shadow-lg w-96 md:w-[450px] z-10">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src="/assets/logo.png" alt="Logo" className="h-20" />
        </div>

        <h2 className="text-center text-xl font-semibold text-gray-800">
          Réinitialisation du mot de passe
        </h2>
        <p className="text-center text-sm text-gray-600 mb-4">
          Veuillez entrer votre nouveau mot de passe.
        </p>

        {/* Affichage du message */}
        {message && (
          <p className="text-center text-green-600 mt-4">{message}</p>
        )}
        {error && <p className="text-center text-red-600 mt-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            className="w-full mt-4 px-4 py-2 border rounded-md focus:ring focus:ring-yellow-500 focus:outline-none"
            placeholder="Nouveau mot de passe"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full mt-4 px-4 py-2 border rounded-md focus:ring focus:ring-yellow-500 focus:outline-none"
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full mt-4 bg-yellow-500 text-white py-2 rounded-lg font-semibold hover:bg-yellow-600 transition"
          >
            Réinitialiser
          </button>
        </form>

        {/* Bouton Retour */}
        <button
          onClick={() => window.history.back()}
          className="absolute top-4 left-4 text-yellow-600 hover:underline"
        >
          &larr; Retour
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
