import React, { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentRestaurant, setCurrentRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Chargement initial depuis le localStorage/session
  useEffect(() => {
    const loadAuthData = () => {
      try {
        const storedUser = localStorage.getItem('restoUser');
        const storedRestaurant = localStorage.getItem('currentRestaurant');
        
        if (storedUser) setUser(JSON.parse(storedUser));
        if (storedRestaurant) setCurrentRestaurant(JSON.parse(storedRestaurant));
      } catch (error) {
        console.error("Erreur de chargement de l'authentification:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthData();
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
    // Si l'utilisateur a un restaurant associé
    if (userData?.restaurant) {
      setCurrentRestaurant(userData.restaurant);
      localStorage.setItem('currentRestaurant', JSON.stringify(userData.restaurant));
    }
    localStorage.setItem('restoUser', JSON.stringify(userData));
  };

  const setRestaurant = (restaurant) => {
    setCurrentRestaurant(restaurant);
    localStorage.setItem('currentRestaurant', JSON.stringify(restaurant));
  };

  const logoutUser = () => {
    localStorage.removeItem('restoUser');
    localStorage.removeItem('currentRestaurant');
    setUser(null);
    setCurrentRestaurant(null);
  };

  // Valeurs exposées par le contexte
  const contextValue = {
    user,
    currentRestaurant,
    isLoading,
    loginUser,
    logoutUser,
    setRestaurant
  };

  return (
    <AppContext.Provider value={contextValue}>
      {!isLoading && children}
    </AppContext.Provider>
  );
};