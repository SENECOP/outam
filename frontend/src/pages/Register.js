import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [typeCommercant, setTypeCommercant] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newCommercant = { nom, email, motDePasse, typeCommercant };

    try {
      const response = await axios.post(
        '${apiUrl}/api/commercant/register',
        newCommercant
      );

      setMessage(response.data.message);
      navigate('/');
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Erreur lors de l'inscription");
      }
    }
  };

  return (
    <div className="relative h-screen w-screen flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/assets/bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>

      <div className="relative bg-white p-10 rounded-lg shadow-lg w-[450px] z-10">
        <div className="flex justify-center mb-4">
          <img src="/assets/logo.png" alt="Logo" className="h-20" />
        </div>

        <h2 className="text-center text-lg font-semibold">Inscription</h2>

        {message && <p className="text-center text-red-600 mt-2">{message}</p>}

        <form className="mt-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700">Nom</label>
          <input
            type="text"
            placeholder="Nom complet"
            className="w-full mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-yellow-500 focus:outline-none"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />

          <label className="block mt-3 text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            placeholder="Adresse email"
            className="w-full mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-yellow-500 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
            required
          />

          <label className="block mt-3 text-sm font-medium text-gray-700">
            Type de commerçant
          </label>
          <select
            className="w-full mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-yellow-500 focus:outline-none"
            value={typeCommercant}
            onChange={(e) => setTypeCommercant(e.target.value)}
            required
          >
            <option value="">Choisir un type</option>
            <option value="hotel">Hôtel</option>
            <option value="restaurant">Restaurant</option>
            <option value="supermarche">Supermarché</option>
          </select>

          <button
            type="submit"
            className="w-full mt-4 bg-yellow-500 text-white py-2 rounded-lg font-semibold hover:bg-yellow-600 transition"
          >
            S'INSCRIRE
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
