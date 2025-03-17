import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email !== "test@example.com" || password !== "password123") {
      setError("Email introuvable ou mot de passe incorrect");
    } else {
      setError("");
      alert("Connexion réussie !");
    }
  };

  return (
    <div className="login-container" >
      <div className="login-box">
        <img src="/logooutam.png" alt="OUTAM Logo" className="logo" />
        <h2>Bienvenue dans votre Univers</h2>
        <h3>Connectez-vous</h3>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={error ? "input-error" : ""}
          />
          <label>Mot de passe</label>
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={error ? "input-error" : ""}
          />
          <div className="options">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Se souvenir de moi
            </label>
            <a href="/forgot-password" className="forgot-password">Mot de passe oublié ?</a>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit">SE CONNECTER</button>
        </form>
        {/* Ajout du lien vers l'inscription */}
        <p className="register-link">Nouveau ici ? <a href="/register">Créer un compte</a>
        </p>
        <p className="support">☎ Service Client : 33 842 23 23</p>
      </div>
    </div>
  );
};

export default Login;