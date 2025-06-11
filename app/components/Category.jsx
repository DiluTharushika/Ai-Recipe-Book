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
const PIXABAY_API_KEY = Constants.expoConfig.extra?.PIXABAY_API_KEY;

export default function Category({ recipes = [], searchQuery = '' }) {
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

  const fetchPixabayImage = async (query) => {
    if (!PIXABAY_API_KEY) {
      console.warn('Missing Pixabay API Key in Constants.expoConfig.extra');
      return null;
    }

    try {
      const response = await fetch(
        `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=3`
      );
      const data = await response.json();
      if (data.hits && data.hits.length > 0) {
        return data.hits[0].webformatURL;
      }
    } catch (error) {
      console.warn('Pixabay fetch failed:', error);
    }
    return null;
  };

  useEffect(() => {
    const prepareAIRecipes = async () => {
      if (!generatedRecipes || generatedRecipes.length === 0 || aiRecipesWithImages.length > 0) return;

      const firestoreTitles = new Set(
        allRecipes.map(r => ((r.title || r.name || '').trim().toLowerCase()))
      );

      const filteredGenerated = generatedRecipes.filter(r => {
        const title = (r.title || r.name || '').trim().toLowerCase();
        return title && !firestoreTitles.has(title);
      });

      const updated = await Promise.all(
        filteredGenerated.map(async (r, idx) => {
          const fallbackImage = r.image
            ? r.image
            : await fetchPixabayImage(r.title || r.name || 'recipe') || AI_PLACEHOLDER_IMAGE;

          return {
            ...r,
            image: fallbackImage,
            id: r.id || `ai-${idx}`,
            _isAI: true,
            category: 'AI Generated'
          };
        })
      );

      setAiRecipesWithImages(updated);
    };

    prepareAIRecipes();
  }, [generatedRecipes, allRecipes]);

  const toggleLike = (recipe) => {
    setLikedRecipes((prev) => {
      const updatedLikes = { ...prev, [recipe.id]: !prev[recipe.id] };
      setFavorites((prevFavorites) => {
        const isLiked = updatedLikes[recipe.id];
        const updatedFavorites = isLiked
          ? [...prevFavorites, recipe]
          : prevFavorites.filter((fav) => fav.id !== recipe.id);

        router.push({
          pathname: '/favourite',
          params: { favorites: JSON.stringify(updatedFavorites) },
        });

        return updatedFavorites;
      });
      return updatedLikes;
    });
  };

  const filteredRecipes = (() => {
    let baseRecipes;

    if (selectedCategory === 'All') {
      const allCombined = [...aiRecipesWithImages, ...allRecipes];

      // Remove duplicates by comparing normalized title
      const seenTitles = new Set();
      baseRecipes = allCombined.filter((r) => {
        const title = (r.title || r.name || '').trim().toLowerCase();
        if (!title || seenTitles.has(title)) return false;
        seenTitles.add(title);
        return true;
      });

    } else if (selectedCategory === 'AI Generated') {
      baseRecipes = aiRecipesWithImages;
    } else {
      baseRecipes = allRecipes.filter(
        (recipe) =>
          recipe.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      baseRecipes = baseRecipes.filter(
        (r) => (r.title || r.name || '').toLowerCase().includes(q)
      );
    }

    return baseRecipes;
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
                source={{
                  uri:
                    typeof item.image === 'string' && item.image.startsWith('http')
                      ? item.image
                      : AI_PLACEHOLDER_IMAGE,
                }}
                style={styles.recipeImage}
              />
              <Text style={styles.recipeName}>
                {item.name || item.title || 'Untitled Recipe'}
              </Text>
              <Text style={styles.recipeDetails}>
                {item.details || 'No description available.'}
              </Text>
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
