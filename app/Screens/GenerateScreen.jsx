import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { router } from "expo-router";
import { useRecipePreferences } from "../../context/RecipeContext";
import Constants from "expo-constants";

export default function GenerateScreen() {
  const { preferences, setGeneratedRecipes } = useRecipePreferences();
  const [loading, setLoading] = useState(true);
  const GROQ_API_KEY = Constants.expoConfig?.extra?.GROQ_API_KEY;

  useEffect(() => {
    const fetchRecipes = async () => {
      if (!GROQ_API_KEY) {
        Alert.alert("API key missing", "Add GROQ_API_KEY to app.json");
        setLoading(false);
        return;
      }

      const prompt = `
You are an AI chef. Return ONLY a pure JSON array – no markdown or explanations.

INPUT
Cuisine(s): ${preferences.cuisines.join(", ")}
Diet: ${preferences.diet}
Meals per day: ${preferences.mealsPerDay}

OUTPUT FORMAT (strict):
[
  {
    "title": "Recipe Name",
    "ingredients": [
      {
        "ingredientName": "Tomatoes",
        "ingredientMeasurement": "2 cups",
        "ingredientCost": 1.5
      }
    ],
    "instructions": "Step-by-step cooking instructions."
  }
]
      `.trim();

      try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama3-8b-8192",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
          }),
        });

        const data = await res.json();
        const content = data.choices?.[0]?.message?.content ?? "";
        console.log("Groq raw:", content);

        // Clean the response
        let jsonText = content
          .trim()
          .replace(/^```json/i, "")
          .replace(/^```/, "")
          .replace(/```$/, "")
          .trim();

        const firstBracket = jsonText.indexOf("[");
        const lastBracket = jsonText.lastIndexOf("]");

        if (firstBracket !== -1 && lastBracket !== -1) {
          jsonText = jsonText.slice(firstBracket, lastBracket + 1);
        }

        try {
          const recipes = JSON.parse(jsonText);

          // Normalize ingredients, clean cost to number
          const validatedRecipes = recipes.map((recipe) => ({
            ...recipe,
            ingredients: recipe.ingredients?.map((ing) => {
              if (typeof ing === "string") {
                return {
                  ingredientName: ing,
                  ingredientMeasurement: "N/A",
                  ingredientCost: 0,
                };
              } else {
                // Remove any non-numeric characters from cost, convert to number
                let costRaw = ing.ingredientCost;
                if (typeof costRaw === "string") {
                  costRaw = costRaw.replace(/[^0-9.]/g, "");
                }
                const costNum = parseFloat(costRaw);
                return {
                  ingredientName: ing.ingredientName || ing.name || "Unknown",
                  ingredientMeasurement: ing.ingredientMeasurement || "N/A",
                  ingredientCost: isNaN(costNum) ? 0 : costNum,
                };
              }
            }) || [],
          }));

          setGeneratedRecipes(validatedRecipes);
          router.replace("/(tabs)/home");
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          console.warn("Raw response looked like:", jsonText);
          Alert.alert("Oops", "Recipe format was broken. Try again.");
          setLoading(false);
        }
      } catch (err) {
        console.error("Generation error:", err);
        Alert.alert("Generation failed", err.message || "Try again.");
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <>
          <ActivityIndicator size="large" color="#f4c38d" style={styles.spinner} />
          <Text style={styles.message}>Generating recipes…</Text>
          <Text style={styles.subMessage}>Please wait a moment</Text>
        </>
      ) : (
        <Text style={styles.error}>Something went wrong. Try again.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  spinner: {
    marginBottom: 25,
  },
  message: {
    fontSize: 22,
    color: "#f4c38d",
    fontWeight: "bold",
    marginBottom: 10,
  },
  subMessage: {
    fontSize: 16,
    color: "#ccc",
  },
  error: {
    fontSize: 16,
    color: "#f66",
    textAlign: "center",
  },
});
