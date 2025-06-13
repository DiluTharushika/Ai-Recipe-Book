import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import Constants from "expo-constants";

const AddAigenerate = () => {
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);

  const GROQ_API_KEY = Constants.expoConfig?.extra?.GROQ_API_KEY;

  // Parse the recipe text to separate ingredients and instructions
  const parseRecipe = (text) => {
    const ingredientsMatch = text.match(/ingredients?:([\s\S]*?)(instructions?:|$)/i);
    const instructionsMatch = text.match(/instructions?:([\s\S]*)/i);

    const ingredientsText = ingredientsMatch ? ingredientsMatch[1].trim() : null;
    const instructionsText = instructionsMatch ? instructionsMatch[1].trim() : null;

    const ingredientsList =
      ingredientsText
        ?.split(/[\r\n,]+/) // split by new line or commas
        .map((item) => item.trim().replace(/^[*•\-\s]+/, "")) // Clean leading stars, bullets, dashes, spaces
        .filter(Boolean) || [];

    const instructionsList =
      instructionsText
        ?.split(/[\r\n]+/) // split instructions by line
        .map((step) => step.trim())
        .filter(Boolean) || [];

    return { ingredientsList, instructionsList };
  };

  const handleGenerate = async () => {
    if (!ingredients.trim()) {
      Alert.alert("Input required", "Please enter some ingredients.");
      return;
    }
    if (!GROQ_API_KEY) {
      Alert.alert("API key missing", "Please add your GROQ_API_KEY in app.json.");
      return;
    }

    setLoading(true);
    setRecipe("");

    try {
      const prompt = `You are a helpful recipe assistant. Generate a clear, well-formatted recipe using the user's ingredients: ${ingredients}`;

      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama3-8b-8192",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 600,
          }),
        }
      );

      const data = await response.json();
      const generatedText = data.choices?.[0]?.message?.content;

      if (!generatedText) {
        setRecipe("No recipe generated. Please try again.");
      } else {
        setRecipe(generatedText);
      }
    } catch (error) {
      console.error("Error generating recipe:", error);
      Alert.alert(
        "Error",
        "Failed to generate recipe. Please check your network or API key."
      );
    } finally {
      setLoading(false);
    }
  };

  const { ingredientsList, instructionsList } = parseRecipe(recipe);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>AI Recipe Generator</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter ingredients (e.g., rice, chicken)"
        placeholderTextColor="#aaa"
        value={ingredients}
        onChangeText={setIngredients}
        multiline
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleGenerate}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Generating..." : "Generate"}
        </Text>
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator size="large" color="#D2B48C" style={{ marginTop: 20 }} />
      )}

      {recipe !== "" && !loading && (
        <View style={styles.recipeContainer}>
          <Text style={styles.recipeTitle}>Generated Recipe</Text>

          {ingredientsList.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Ingredients</Text>
              {ingredientsList.map((item, idx) => (
                <Text key={idx} style={styles.ingredientItem}>
                  {/* Bullet point */}
                  {'\u2022'} {item}
                </Text>
              ))}
            </>
          )}

          {instructionsList.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Instructions</Text>
              {instructionsList.map((step, idx) => (
                <View key={idx} style={styles.instructionStep}>
                  <Text style={styles.stepNumber}>Step {idx + 1}:</Text>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </>
          )}

          {/* Fallback if instructions not parsed */}
          {instructionsList.length === 0 && (
            <Text style={styles.instructionsText}>{recipe}</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#262626",
    padding: 20,
    padding: 25,
    flexGrow: 1,
    paddingTop:40
  },
  title: {
    fontSize: 24,
    color: "#D2B48C",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#363636",
    color: "white",
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#555",
    minHeight: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#8B4513",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  recipeContainer: {
    marginTop: 30,
    backgroundColor: "#3a3a3a",
    padding: 20,
    borderRadius: 10,
  },
  recipeTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#D2B48C",
    marginBottom: 15,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f0d9a6",
    marginBottom: 8,
    marginTop: 10,
  },
  ingredientItem: {
    fontSize: 16,
    color: "#eaeaea",
    marginLeft: 10,
    marginBottom: 4,
  },
  instructionStep: {
    flexDirection: "row",
    marginBottom: 10,
  },
  stepNumber: {
    fontWeight: "bold",
    color: "#D2B48C",
    marginRight: 6,
    fontSize: 16,
  },
  stepText: {
    fontSize: 16,
    color: "#ddd",
    flex: 1,
   
  },
  instructionsText: {
    fontSize: 11,
    color: "#ddd",
    lineHeight: 22,
    marginTop: 4,
  },
});

export default AddAigenerate;
