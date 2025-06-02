import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function Favourite() {
  const route = useRoute();
  const navigation = useNavigation();

  // Safely get favorites param:
  // If favorites is already an array, use it directly.
  // If it's a JSON string, parse it.
  // Otherwise default to empty array.
  let favorites = [];

  const favoritesParam = route.params?.favorites;

  if (Array.isArray(favoritesParam)) {
    favorites = favoritesParam;
  } else if (typeof favoritesParam === 'string' && favoritesParam.trim() !== '') {
    try {
      favorites = JSON.parse(favoritesParam);
    } catch (error) {
      console.warn('Failed to parse favorites JSON:', error);
      favorites = [];
    }
  } else {
    favorites = [];
  }

  const handleRecipePress = (item) => {
    if (item._isAI) {
      navigation.navigate('Screens/RecipeDetail', { recipe: JSON.stringify(item) });
    } else {
      navigation.navigate('Screens/RecipeDetail', { id: item.id });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favourite Recipes</Text>

      {favorites.length === 0 ? (
        <Text style={styles.emptyMessage}>No favorite recipes yet. Tap the heart to add!</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleRecipePress(item)} style={styles.recipeCard}>
              <Image source={{ uri: item.image }} style={styles.recipeImage} />
              <Text style={styles.recipeName}>{item.name || item.title || 'Unnamed Recipe'}</Text>
              <Text style={styles.recipeDetails}>{item.details || 'No details available.'}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    padding: 30,
  },
  title: {
    color: '#b35900',
    fontFamily: 'outfit-medium',
    fontSize: 25,
    marginBottom: 10,
  },
  emptyMessage: {
    color: '#AAA',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  recipeCard: {
    backgroundColor: '#333',
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
  },
  recipeImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  recipeName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'outfit-medium',
    marginTop: 5,
  },
  recipeDetails: {
    color: '#cccccc',
    fontSize: 14,
    fontFamily: 'outfit',
    marginTop: 3,
  },
});
