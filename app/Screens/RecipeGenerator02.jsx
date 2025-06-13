import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useRecipePreferences } from "../../context/RecipeContext"; // adjust if needed
import * as Animatable from "react-native-animatable";

const preferences = [
  "Vegetarian 🥦 (No meat, but allows dairy & eggs)",
  "Vegan 🌱 (No animal products, including dairy & eggs)",
  "Keto 🥓 (Low-carb, high-fat diet)",
  "Halal 🍖 (Prepared according to Islamic dietary laws)",
  "No Restrictions 🥗🍕 (I eat everything!)",
];

export default function RecipeGenerator02() {
  const router = useRouter();
  const [selected, setSelected] = useState(null);
  const { setPreferences } = useRecipePreferences();

  const handleNext = () => {
    if (selected) {
      setPreferences(prev => ({
        ...prev,
        diet: selected,
      }));
      router.push("/Screens/RecipeGenerator03");
    }
  };

  return (
    <Animatable.View animation="fadeIn" duration={800} style={styles.container}>
      <Text style={styles.question}>Do you have any dietary preferences?</Text>

      {preferences.map((item, index) => {
        const isSelected = selected === item;
        return (
          <Animatable.View
            key={index}
            animation="fadeInUp"
            delay={100 * index}
            useNativeDriver
          >
            <TouchableOpacity
              style={[styles.option, isSelected && styles.selectedOption]}
              onPress={() => setSelected(item)}
              activeOpacity={0.7}
            >
              <Text style={[styles.optionText, isSelected && styles.selectedText]}>
                {isSelected ? "🔘" : "⚪"} {item}
              </Text>
            </TouchableOpacity>
          </Animatable.View>
        );
      })}

      <Animatable.View animation="zoomIn" delay={100 * preferences.length} useNativeDriver>
        <TouchableOpacity
          style={[styles.nextBtn, !selected && { backgroundColor: "#555" }]}
          onPress={handleNext}
          disabled={!selected}
          activeOpacity={0.8}
        >
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      </Animatable.View>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1e1e1e", padding: 25, 
    paddingTop:45, },
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
