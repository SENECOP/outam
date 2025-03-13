import { useState } from "react";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/commercant/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Une erreur est survenue");
      }

      setMessage("Email envoyé avec succès ! Vérifiez votre boîte de réception.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <button onClick={() => window.history.back()} className="back-button">&larr; Retour</button>
        <h2 className="title">Mot de passe oublié ?</h2>
        <p className="subtitle">Pas de panique, nous allons vous aider à renouveler votre mot de passe.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="input-field"
            placeholder="Adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? "Envoi..." : "RÉINITIALISER MOT DE PASSE"}
          </button>
        </form>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <p className="support-text">⚠ Service Client : <span className="support-number">33 843 22 33</span></p>
      </div>
    </div>
  );
};

export default ForgotPassword;