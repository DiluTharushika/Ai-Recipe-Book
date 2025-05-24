import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Image
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

export default function Category() {
  const router = useRouter();

  const allPossibleCategories = ['All', 'AI Generated', 'BreakFast', 'Lunch', 'FastFood', 'Dinner', 'Dessert'];

  const [allRecipes, setAllRecipes] = useState([]);
  const [likedRecipes, setLikedRecipes] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'recipes'));
        const recipeList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllRecipes(recipeList);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, []);

  const toggleLike = (recipe) => {
    setLikedRecipes((prev) => {
      const updatedLikes = { ...prev, [recipe.id]: !prev[recipe.id] };
      setFavorites((prevFavorites) => {
        const isLiked = updatedLikes[recipe.id];
        const updatedFavorites = isLiked
          ? [...prevFavorites, recipe]
          : prevFavorites.filter((fav) => fav.id !== recipe.id);
        router.push({
          pathname: '/Screens/favourite',
          params: { favorites: JSON.stringify(updatedFavorites) },
        });
        return updatedFavorites;
      });
      return updatedLikes;
    });
  };

  const filteredRecipes =
    selectedCategory === 'All'
      ? allRecipes
      : allRecipes.filter(
          (recipe) =>
            recipe.category?.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      <FlatList
        data={allPossibleCategories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryItem,
              selectedCategory === item && styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory(item)}
          >
            <Text style={styles.categoryText}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      <Text style={styles.title02}>My Recipes</Text>
      <FlatList
        data={filteredRecipes}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.recipeCard}>
            <TouchableOpacity
              style={styles.heartIcon}
              onPress={() => toggleLike(item)}
            >
              <FontAwesome
                name="heart"
                size={22}
                color={likedRecipes[item.id] ? 'red' : '#999'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/Screens/RecipeDetail',
                  params: { id: item.id }, // ✅ Pass only the ID
                })
              }
            >
              <Image source={{ uri: item.image }} style={styles.recipeImage} />
              <Text style={styles.recipeName}>{item.name}</Text>
              <Text style={styles.recipeDetails}>{item.details}</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No recipes found in this category.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 2,
    paddingBottom: 20,
  },
  title: {
    color: '#FFFFFF',
    fontFamily: 'outfit-medium',
    fontSize: 20,
    margin: 7,
  },
  title02: {
    color: '#FFFFFF',
    fontFamily: 'outfit-medium',
    fontSize: 20,
    marginBottom: 10,
    marginTop: 10,
  },
  categoryItem: {
    backgroundColor: '#4d4d4d',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    borderColor: '#994d00',
    borderWidth: 1.5,
  },
  selectedCategory: {
    backgroundColor: '#994d00',
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'outfit',
  },
  recipeCard: {
    backgroundColor: '#333',
    borderRadius: 15,
    padding: 10,
    marginRight: 10,
    width: 210,
    position: 'relative',
  },
  heartIcon: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 1,
    backgroundColor: '#333',
    width: 30,
    height: 30,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeImage: {
    width: '100%',
    height: 210,
    borderRadius: 10,
  },
  recipeName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'outfit-medium',
    marginTop: 5,
  },
  recipeDetails: {
    color: '#cccccc',
    fontSize: 13,
    fontFamily: 'outfit',
    marginTop: 3,
  },
  emptyText: {
    color: '#aaa',
    fontSize: 16,
    padding: 20,
    textAlign: 'center',
  },
});
