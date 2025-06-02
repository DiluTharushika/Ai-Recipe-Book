import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartRecipes, setCartRecipes] = useState([]);

  const addToCart = (recipe) => {
    // Avoid duplicates by recipe ID if available
    setCartRecipes((prev) => {
      if (recipe.id && prev.find((r) => r.id === recipe.id)) {
        return prev;
      }
      return [...prev, recipe];
    });
  };

  const clearCart = () => setCartRecipes([]);

  return (
    <CartContext.Provider value={{ cartRecipes, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
