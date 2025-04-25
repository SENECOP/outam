import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie'; // Pour manipuler les cookies

function Login() {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(['accessToken', 'refreshToken']); // On utilise le hook useCookies pour accéder aux cookies
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post(
        'https://outam.onrender.com/api/commercant/login',
        {
          email,
          motDePasse,
          rememberMe,
        }
      );

      // Si l'authentification réussie, on enregistre les cookies
      setCookie('accessToken', response.data.token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Assurez-vous que les cookies sont sécurisés en production
        maxAge: rememberMe ? 30 * 24 * 60 * 60 : 60 * 60, // 30 jours si rememberMe, sinon 1h
      });

      // Rediriger l'utilisateur vers le tableau de bord en fonction du type de commerçant
      const typeCommercant = response.data.typeCommercant;
      if (typeCommercant === 'restaurant') {
        navigate('/restodashboard');
      } else if (typeCommercant === 'hotel') {
        navigate('/hoteldashboard');
      } else if (typeCommercant === 'supermarche') {
        navigate('/supermarkedashboard');
      } else {
        setMessage('Erreur lors de la redirection.');
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Erreur de connexion.');
      }
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
      <div className="relative bg-white p-8 rounded-lg shadow-lg w-96 z-10">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src="/assets/logo.png" alt="Logo" className="h-20" />
        </div>

        {/* Titre */}
        <h2 className="text-center text-lg font-semibold">
          Bienvenue dans votre Univers
        </h2>

        {/* Formulaire */}
        <form className="mt-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            placeholder="Adresse email"
            className="w-full mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-yellow-500 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="block mt-3 text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <input
            type="password"
            placeholder="Mot de passe"
            className="w-full mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-yellow-500 focus:outline-none"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
          />

          <div className="flex items-center justify-between mt-3">
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                className="mr-1"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              Se souvenir de moi
            </label>
            <a
              href="/forgot-password"
              className="text-sm text-yellow-600 hover:underline"
            >
              Mot de passe oublié
            </a>
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-yellow-500 text-white py-2 rounded-lg font-semibold hover:bg-yellow-600 transition"
          >
            SE CONNECTER
          </button>
        </form>

        {/* Affichage du message */}
        {message && <p className="text-center text-red-600 mt-2">{message}</p>}

        {/* Service Client */}
        <div className="mt-4 text-center text-sm text-red-600 flex items-center justify-center">
          <span className="mr-1">⚠️</span>
          <a href="tel:338432233" className="underline">
            Service Client : 33 843 22 33
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
