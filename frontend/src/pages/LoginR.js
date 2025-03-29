// LoginR.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const LoginR = () => {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth(); // Utilisation du contexte pour la connexion
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, motDePasse); // Appel de la fonction de login du contexte

      // Redirection vers la page d'accueil après une connexion réussie
      navigate('/homer'); // Ou la page que vous souhaitez
    } catch (err) {
      setError('Erreur de connexion. Vérifiez vos identifiants.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-semibold text-center mb-6">Connexion</h1>
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <input
            type="password"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
};

export default LoginR;
