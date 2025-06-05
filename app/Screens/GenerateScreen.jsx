import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useRecipePreferences } from "../../context/RecipeContext";
import Constants from "expo-constants";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { getAuth } from "firebase/auth";

export default function GenerateScreen() {
  const { preferences, setGeneratedRecipes } = useRecipePreferences();
  const [loading, setLoading] = useState(true);

  const GROQ_API_KEY = Constants.expoConfig?.extra?.GROQ_API_KEY;
  const PIXABAY_API_KEY = Constants.expoConfig?.extra?.PIXABAY_API_KEY;

  const getRandomPixabayImage = async () => {
    try {
      const response = await fetch(
        `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=food&image_type=photo`
      );
      const data = await response.json();
      if (data.hits?.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.hits.length);
        return data.hits[randomIndex].webformatURL;
      }
    } catch (err) {
      console.error("Pixabay fetch error:", err);
    }
    // Return a static fallback image if Pixabay fails
    return "https://cdn.pixabay.com/photo/2017/05/07/08/56/breakfast-2299784_1280.jpg";
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      if (!GROQ_API_KEY || !PIXABAY_API_KEY) {
        Alert.alert("Missing API Key", "Set GROQ_API_KEY and PIXABAY_API_KEY in app.json");
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

        const recipes = JSON.parse(jsonText);
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

        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          Alert.alert("Error", "User not authenticated.");
          setLoading(false);
          return;
        }

        await Promise.all(
          validatedRecipes.map(async (recipe) => {
            const fallbackImage = await getRandomPixabayImage();
            await addDoc(collection(db, "recipes"), {
              ...recipe,
              image: fallbackImage,
              createdAt: serverTimestamp(),
              createdBy: user.uid,
              category: "AI Generated",
              _isAI: true,
            });
          })
        );

        setGeneratedRecipes(validatedRecipes);
        router.replace("/(tabs)/home");
      } catch (err) {
        console.error("Error during generation:", err);
        Alert.alert("Failed to generate recipes", err.message || "Try again.");
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
