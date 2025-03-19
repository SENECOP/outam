import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [typeCommercant, setTypeCommercant] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newCommercant = { nom, email, motDePasse, typeCommercant };

    try {
      const response = await axios.post('http://localhost:5000/api/commercant/register', newCommercant);

      // Si l'inscription réussie, on peut rediriger l'utilisateur
      setMessage(response.data.message);
      navigate('/'); // Rediriger vers la page de login après l'inscription
    } catch (error) {
      // Si erreur, on affiche le message d'erreur
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Erreur lors de l\'inscription');
      }
    }
  };

  return (
    <div className="register-container">

      <h2>Inscription</h2>
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nom">Nom</label>
          <input
            type="text"
            id="nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="motDePasse">Mot de passe</label>
          <input
            type="password"
            id="motDePasse"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="typeCommercant">Type de commerçant</label>
          <select
            id="typeCommercant"
            value={typeCommercant}
            onChange={(e) => setTypeCommercant(e.target.value)}
            required
          >
            <option value="">Choisir un type</option>
            <option value="hotel">Hotel</option>
            <option value="restaurant">Restaurant</option>
            <option value="supermarche">Supermarche</option>

            {/* Ajoute d'autres options si nécessaire */}
          </select>
        </div>
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
}

export default Register;
