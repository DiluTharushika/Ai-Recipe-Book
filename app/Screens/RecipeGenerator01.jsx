import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const cuisines = [
  "Italian 🍕", "Sri Lankan 🍛", "Chinese 🍜", "Indian 🍲",
  "Mexican 🌮", "Japanese 🍣", "French 🥖", "Others"
];

export default function RecipeGenerator01() {
  const router = useRouter();
  const [selectedCuisines, setSelectedCuisines] = useState([]);

  const toggleCuisine = (cuisine) => {
    if (selectedCuisines.includes(cuisine)) {
      setSelectedCuisines(selectedCuisines.filter(item => item !== cuisine));
    } else {
      setSelectedCuisines([...selectedCuisines, cuisine]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>Which cuisines make you hungry?</Text>
      {cuisines.map((item, index) => {
        const isSelected = selectedCuisines.includes(item);
        return (
          <TouchableOpacity
            key={index}
            style={[styles.option, isSelected && styles.selectedOption]}
            onPress={() => toggleCuisine(item)}
          >
            <Text style={[styles.optionText, isSelected && styles.selectedText]}>
              {isSelected ? "🔘" : "⚪"} {item}
            </Text>
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity
        style={styles.nextBtn}
        onPress={() => router.push("/Screens/RecipeGenerator02")}
      >
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>
    </View>
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
  nextBtn: {
    marginTop: 30,
    backgroundColor: "#8b5e3c",
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
