import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useRecipePreferences } from "../../context/RecipeContext"; // adjust path if needed
import * as Animatable from "react-native-animatable";

const meals = [
  "🍞 Breakfast only",
  "🍛 Lunch + Dinner",
  "🍽 All three",
  "🍰 All + Desserts",
];

export default function RecipeGenerator03() {
  const router = useRouter();
  const [selectedMeal, setSelectedMeal] = useState(null);
  const { setPreferences } = useRecipePreferences();

  const handleGenerate = () => {
    if (selectedMeal) {
      setPreferences(prev => ({
        ...prev,
        mealsPerDay: selectedMeal,
      }));
      router.push("/Screens/GenerateScreen");
    }
  };

  return (
    <Animatable.View animation="fadeIn" duration={800} style={styles.container}>
      <Text style={styles.question}>Meals to plan per day</Text>

      {meals.map((item, index) => {
        const isSelected = selectedMeal === item;
        return (
          <Animatable.View
            key={index}
            animation="fadeInUp"
            delay={100 * index}
            useNativeDriver
          >
            <TouchableOpacity
              style={[styles.option, isSelected && styles.selectedOption]}
              onPress={() => setSelectedMeal(item)}
              activeOpacity={0.7}
            >
              <Text style={[styles.optionText, isSelected && styles.selectedText]}>
                {isSelected ? "🔘" : "⚪"} {item}
              </Text>
            </TouchableOpacity>
          </Animatable.View>
        );
      })}

      <Animatable.View animation="zoomIn" delay={100 * meals.length} useNativeDriver>
        <TouchableOpacity
          style={[styles.generateBtn, !selectedMeal && { backgroundColor: "#555" }]}
          onPress={handleGenerate}
          disabled={!selectedMeal}
          activeOpacity={0.8}
        >
          <Text style={styles.generateText}>Generate</Text>
        </TouchableOpacity>
      </Animatable.View>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1e1e1e", padding: 20 },
  question: {
    color: "#f4c38d",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  option: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#aaa",
    marginBottom: 15,
  },
  selectedOption: {
    borderColor: "#a97454",
    backgroundColor: "#2e2e2e",
  },
  optionText: {
    color: "#fff",
    fontSize: 16,
  },
  selectedText: {
    color: "#f4c38d",
    fontWeight: "bold",
  },
  generateBtn: {
    marginTop: 30,
    backgroundColor: "#8B4513",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  generateText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
