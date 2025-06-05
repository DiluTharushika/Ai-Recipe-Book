import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useRecipePreferences } from "../../context/RecipeContext"; // adjust the path if needed
import * as Animatable from "react-native-animatable";

const cuisines = [
  "Italian 🍕", "Chinese 🍜", "Indian 🍲",
  "Mexican 🌮", "Japanese 🍣", "French 🥖", "Thai 🍲", "Others"
];

export default function RecipeGenerator01() {
  const router = useRouter();
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const { preferences, setPreferences } = useRecipePreferences();

  const toggleCuisine = (cuisine) => {
    if (selectedCuisines.includes(cuisine)) {
      setSelectedCuisines(selectedCuisines.filter(item => item !== cuisine));
    } else {
      setSelectedCuisines([...selectedCuisines, cuisine]);
    }
  };

  const handleNext = () => {
    setPreferences(prev => ({
      ...prev,
      cuisines: selectedCuisines,
    }));
    router.push("/Screens/RecipeGenerator02");
  };

  return (
    <Animatable.View animation="fadeIn" duration={800} style={styles.container}>
      <Text style={styles.question}>Which cuisines make you hungry?</Text>

      {cuisines.map((item, index) => {
        const isSelected = selectedCuisines.includes(item);
        return (
          <Animatable.View
            key={index}
            animation="fadeInUp"
            delay={100 * index}
            useNativeDriver
          >
            <TouchableOpacity
              style={[styles.option, isSelected && styles.selectedOption]}
              onPress={() => toggleCuisine(item)}
              activeOpacity={0.7}
            >
              <Text style={[styles.optionText, isSelected && styles.selectedText]}>
                {isSelected ? "🔘" : "⚪"} {item}
              </Text>
            </TouchableOpacity>
          </Animatable.View>
        );
      })}

      <Animatable.View animation="zoomIn" delay={100 * cuisines.length} useNativeDriver>
        <TouchableOpacity
          style={[styles.nextBtn, selectedCuisines.length === 0 && { opacity: 0.5 }]}
          onPress={handleNext}
          disabled={selectedCuisines.length === 0}
          activeOpacity={0.8}
        >
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      </Animatable.View>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    padding: 20,
  },
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
    borderColor: "#FFA500",
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
  nextBtn: {
    marginTop: 30,
    backgroundColor: "#8B4513",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  nextText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
