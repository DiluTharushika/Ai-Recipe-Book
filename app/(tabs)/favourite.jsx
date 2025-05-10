import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import React from 'react';
import { useRoute } from '@react-navigation/native';

export default function Favourite() {
  const route = useRoute();
  const favorites = route.params?.favorites || []; // Get favorite recipes from navigation params

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
            <View style={styles.recipeCard}>
              <Image source={item.image} style={styles.recipeImage} />
              <Text style={styles.recipeName}>{item.name}</Text>
              <Text style={styles.recipeDetails}>{item.details}</Text>
            </View>
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
    padding: 10,
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
