import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const loginUser = (userData) => {
    setUser(userData); // Mettre à jour l'utilisateur avec toutes ses données
  };

  const logoutUser = () => {
    setUser(null); // Réinitialiser l'utilisateur lors de la déconnexion
  };

  return (
    <AppContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AppContext.Provider>
  );
};
