// context/RecipeContext.js
import React, { createContext, useContext, useState } from "react";

const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
  const [preferences, setPreferences] = useState({
    cuisines: [],
    diet: "",
    mealsPerDay: 1,
  });

  const [generatedRecipes, setGeneratedRecipes] = useState([]);

  return (
    <RecipeContext.Provider
      value={{
        preferences,
        setPreferences,
        generatedRecipes,
        setGeneratedRecipes, // ✅ This was missing
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipePreferences = () => useContext(RecipeContext);
