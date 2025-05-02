// CartContext.js
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  // Charger le panier depuis localStorage au montage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  // Sauvegarder le panier dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Calculer le total et le nombre d'articles
    const newTotal = cart.reduce(
      (sum, item) => sum + item.quantity * (item.dish?.price || 0),
      0
    );
    const newCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    setTotal(newTotal);
    setItemCount(newCount);
  }, [cart]);

  const updateQuantity = (index, delta) => {
    setCart((prevCart) => {
      const newCart = prevCart
        .map((item, i) => {
          if (i === index) {
            const newQuantity = item.quantity + delta;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter(Boolean);
      return newCart;
    });
  };

  const value = {
    cart,
    total,
    itemCount,
    updateQuantity,
    setCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};