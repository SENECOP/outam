import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ResetPassword.css";  // Ajoute ton CSS ici

const ResetPasswordPage = () => {
  const { token } = useParams();  // Récupérer le token depuis l'URL
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/commercant/reset-password/${token}`, { newPassword });
      setMessage(response.data.message);
      setError("");

      // Rediriger vers la page de connexion après 3 secondes
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la réinitialisation.");
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <h2 className="title">Réinitialisation du mot de passe</h2>
        <p className="subtitle">Veuillez entrer votre nouveau mot de passe.</p>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            className="input-field"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            className="input-field"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className="submit-button">Réinitialiser</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
