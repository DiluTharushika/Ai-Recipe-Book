import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function RecipeView({ route }) {
  const { recipe } = route?.params || { recipe: {} }; // fallback
  const navigation = useNavigation();

  const handleAddToCart = () => {
    Alert.alert('Added to Cart', `${recipe.name} has been added to your shopping cart.`);
    // TODO: Add real cart logic here (e.g., update context, firestore, etc.)
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={recipe.image} style={styles.image} />

      {/* Floating Icons */}
      <View style={styles.topIcons}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Spacer to center the buttons */}
        <View style={{ flex: 1 }} />

        {/* Cart Button */}
        <TouchableOpacity style={styles.iconBtn} onPress={handleAddToCart}>
          <MaterialIcons name="shopping-cart" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Recipe Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.recipeName}>{recipe.name}</Text>

        <Text style={styles.sectionTitle}>Ingredients</Text>
        {recipe.ingredients?.length > 0 ? (
          recipe.ingredients.map((item, index) => (
            <Text key={`${item}-${index}`} style={styles.ingredientText}>• {item}</Text>
          ))
        ) : (
          <Text style={styles.ingredientText}>No ingredients listed.</Text>
        )}

        <Text style={styles.sectionTitle}>Instructions</Text>
        <Text style={styles.instructionText}>
          {recipe.instructions || "No instructions provided."}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 16 / 9,
    resizeMode: 'cover',
  },
  topIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
  },
  iconBtn: {
    backgroundColor: '#000000aa',
    padding: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
  },
  detailsContainer: {
    padding: 16,
  },
  recipeName: {
    fontSize: 24,
    color: '#fff',
    fontFamily: 'outfit-medium',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#ffaa00',
    marginTop: 15,
    fontFamily: 'outfit-medium',
  },
  ingredientText: {
    color: '#ccc',
    fontSize: 15,
    marginVertical: 2,
    fontFamily: 'outfit',
  },
  instructionText: {
    color: '#ddd',
    fontSize: 14,
    marginTop: 5,
    fontFamily: 'outfit',
  },
});
