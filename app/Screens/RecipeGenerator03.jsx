import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const meals = [
  "🍞 Breakfast only",
  "🍛 Lunch + Dinner",
  "🍽 All three",
  "Other",
];

export default function RecipeGenerator03() {
  const router = useRouter();
  const [selectedMeal, setSelectedMeal] = useState(null);

  return (
    <View style={styles.container}>
      <Text style={styles.question}>Meals to plan per day</Text>
      {meals.map((item, index) => {
        const isSelected = selectedMeal === item;
        return (
          <TouchableOpacity
            key={index}
            style={[styles.option, isSelected && styles.selectedOption]}
            onPress={() => setSelectedMeal(item)}
          >
            <Text style={[styles.optionText, isSelected && styles.selectedText]}>
              {isSelected ? "🔘" : "⚪"} {item}
            </Text>
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity
        style={styles.generateBtn}
        onPress={() => router.push("/Screens/GenerateScreen")}
      >
        <Text style={styles.generateText}>Generate</Text>
      </TouchableOpacity>
    </View>
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
    backgroundColor: "#8b5e3c",
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
