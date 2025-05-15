import React, { createContext, useContext, useState, useEffect } from 'react';

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
        if (storedRestaurant)
          setCurrentRestaurant(JSON.parse(storedRestaurant));
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
    if (userData?.restaurant) {
      setCurrentRestaurant(userData.restaurant);
      localStorage.setItem(
        'currentRestaurant',
        JSON.stringify(userData.restaurant)
      );
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

  const [categories, setCategories] = useState([]);

  // Charger les catégories depuis le localStorage au démarrage
  useEffect(() => {
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    }
  }, []);

  // Sauvegarder les catégories dans le localStorage chaque fois qu'elles changent
  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem('categories', JSON.stringify(categories));
    }
  }, [categories]);

  // Ajouter une nouvelle catégorie
  const addCategory = (newCategory) => {
    setCategories((prevCategories) => [...prevCategories, newCategory]);
  };

  // Supprimer une catégorie
  const removeCategory = (index) => {
    setCategories((prevCategories) => {
      const updatedCategories = [...prevCategories];
      updatedCategories.splice(index, 1);
      return updatedCategories;
    });
  };

  // Valeurs exposées par le contexte
  const contextValue = {
    user,
    currentRestaurant,
    isLoading,
    loginUser,
    logoutUser,
    setRestaurant,
    categories, 
    addCategory, 
    removeCategory,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {!isLoading && children}
    </AppContext.Provider>
  );
};
