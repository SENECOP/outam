// AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [commercant, setCommercant] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fonction pour récupérer les informations du commerçant
  const fetchCommercantInfo = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/api/commercant/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCommercant(response.data); // Mettre à jour les infos du commerçant
    } catch (err) {
      console.error("Erreur de récupération du commerçant", err);
    } finally {
      setLoading(false);
    }
  };

  // Effet pour vérifier si un token existe dans le cookie ou autre stockage sécurisé
  useEffect(() => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");

    if (token) {
      fetchCommercantInfo(token);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, motDePasse) => {
    try {
      const response = await axios.post('http://localhost:5000/api/commercant/loginr', { email, motDePasse });
      const token = response.data.token;

      // Mettre le token dans les cookies
      document.cookie = `token=${token}; path=/;`;

      // Récupérer les informations du commerçant
      fetchCommercantInfo(token);
    } catch (err) {
      throw new Error("Erreur de connexion.");
    }
  };

  const logout = () => {
    setCommercant(null);
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"; // Supprimer le cookie
  };

  return (
    <AuthContext.Provider value={{ commercant, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
