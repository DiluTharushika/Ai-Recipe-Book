import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Image
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { useRecipePreferences } from '../../context/RecipeContext';
import Constants from 'expo-constants';

const AI_PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x220.png?text=AI+Recipe+Image';
const UNSPLASH_ACCESS_KEY = Constants.expoConfig.extra.UNSPLASH_ACCESS_KEY;

export default function Category() {
  const router = useRouter();
  const allPossibleCategories = ['All', 'AI Generated', 'BreakFast', 'Lunch', 'FastFood', 'Dinner', 'Dessert'];

  const [allRecipes, setAllRecipes] = useState([]);
  const [likedRecipes, setLikedRecipes] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [aiRecipesWithImages, setAiRecipesWithImages] = useState([]);

  const { generatedRecipes } = useRecipePreferences();

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

  useEffect(() => {
    const fetchUnsplashImage = async (query) => {
      try {
        const response = await fetch(
          `https://api.unsplash.com/search/photos?page=1&query=${encodeURIComponent(query)}&client_id=${UNSPLASH_ACCESS_KEY}`
        );
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          return data.results[0].urls.regular;
        }
      } catch (error) {
        console.warn('Unsplash fetch failed:', error);
      }
      return null;
    };

    const prepareAIRecipes = async () => {
      if (!generatedRecipes) return;
      const updated = await Promise.all(
        generatedRecipes.map(async (r, idx) => {
          const fallbackImage = r.image
            ? r.image
            : await fetchUnsplashImage(r.title || r.name || 'recipe') || AI_PLACEHOLDER_IMAGE;

          return {
            ...r,
            image: fallbackImage,
            id: r.id || `ai-${idx}`,
            _isAI: true,
          };
        })
      );
      setAiRecipesWithImages(updated);
    };

    prepareAIRecipes();
  }, [generatedRecipes]);

  const toggleLike = (recipe) => {
    setLikedRecipes((prev) => {
      const updatedLikes = { ...prev, [recipe.id]: !prev[recipe.id] };
      setFavorites((prevFavorites) => {
        const isLiked = updatedLikes[recipe.id];
        const updatedFavorites = isLiked
          ? [...prevFavorites, recipe]
          : prevFavorites.filter((fav) => fav.id !== recipe.id);

        // Navigate to favorites screen with updated favorites
        router.push({
          pathname: '/favourite', // <- adjust if your path differs
          params: { favorites: JSON.stringify(updatedFavorites) },
        });

        return updatedFavorites;
      });
      return updatedLikes;
    });
  };

  const filteredRecipes = (() => {
    if (selectedCategory === 'All') return allRecipes;
    if (selectedCategory === 'AI Generated') return aiRecipesWithImages;
    return allRecipes.filter(
      (recipe) =>
        recipe.category?.toLowerCase() === selectedCategory.toLowerCase()
    );
  })();

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
                  params: item._isAI
                    ? { recipe: JSON.stringify(item) }
                    : { id: item.id },
                })
              }
            >
              <Image
                source={{ uri: item.image || AI_PLACEHOLDER_IMAGE }}
                style={styles.recipeImage}
              />
              <Text style={styles.recipeName}>{item.name || item.title}</Text>
              <Text style={styles.recipeDetails}>{item.details || ''}</Text>
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
    backgroundColor: '#222',
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
