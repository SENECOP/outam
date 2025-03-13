import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post("http://localhost:5000/api/commercant/login", {
        email,
        motDePasse,
        rememberMe,
      });

      // Stocker le token dans localStorage ou cookies si rememberMe est activé
      localStorage.setItem("token", response.data.token);
      setMessage("Connexion réussie !");
      navigate("/dashboard"); // Redirige vers le tableau de bord

    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Erreur de connexion.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src="/assets/logo.png" alt="Logo Outam" className="logo" />
        <h2>Bienvenue dans votre Univers</h2>
        <p className="subtitle">Connectez-vous</p>

        {message && <div className="message">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Adresse email"
            />
          </div>

          <div>
            <label>Mot de passe</label>
            <input
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
              placeholder="Mot de passe"
            />
          </div>

          <div className="remember-forgot">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Se souvenir de moi
            </label>
            <Link to="/forgot-password">Mot de passe oublié ?</Link>
          </div>

          <button type="submit" className="login-btn">SE CONNECTER</button>
        </form>

        <p className="support">
          ⚠ <span>Service Client :</span> <a href="tel:+3338432233">33 843 22 33</a>
        </p>
      </div>
    </div>
  );
}

export default Login;