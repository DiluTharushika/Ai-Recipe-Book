import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import Constants from 'expo-constants';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AI_PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x220.png?text=AI+Recipe+Image';
const UNSPLASH_ACCESS_KEY = Constants.expoConfig.extra.UNSPLASH_ACCESS_KEY;

export default function RecipeDetail() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id, recipe: recipeParam } = route.params || {};

  const [recipes, setRecipes] = useState(null);
  const [creatorNames, setCreatorNames] = useState([]);
  const [loading, setLoading] = useState(true);

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
      console.warn('❌ Unsplash image fetch failed:', error);
    }
    return null;
  };

  useEffect(() => {
    async function fetchCreatorName(uid) {
      if (!uid) return 'Anonymous';
      try {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          return userData.username || 'Unknown';
        }
        return 'Unknown';
      } catch {
        return 'Unknown';
      }
    }

    const parseAndSetRecipes = async () => {
      if (recipeParam) {
        try {
          const parsed = JSON.parse(recipeParam);
          let arr = Array.isArray(parsed) ? parsed : [parsed];

          const updatedRecipes = await Promise.all(
            arr.map(async (recipe) => {
              if (!recipe.image || recipe.image.trim() === '') {
                const fallbackImage = await fetchUnsplashImage(recipe.title || recipe.name || 'recipe');
                return { ...recipe, image: fallbackImage || AI_PLACEHOLDER_IMAGE };
              }
              return recipe;
            })
          );

          const creators = updatedRecipes.map((r) => r.createdBy || 'AI Generated');
          setRecipes(updatedRecipes);
          setCreatorNames(creators);
          setLoading(false);
          return;
        } catch (e) {
          console.warn('❌ Failed to parse recipe param:', e);
          setLoading(false);
          return;
        }
      }

      if (!id) {
        console.warn('❌ No recipe ID provided in route params.');
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'recipes', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const fetchedRecipe = { id: docSnap.id, ...data };

          if (!fetchedRecipe.image || fetchedRecipe.image.trim() === '') {
            fetchedRecipe.image =
              (await fetchUnsplashImage(fetchedRecipe.title || fetchedRecipe.name || 'recipe')) ||
              AI_PLACEHOLDER_IMAGE;
          }

          const creatorName = await fetchCreatorName(data.createdByUid);

          setRecipes([fetchedRecipe]);
          setCreatorNames([creatorName]);
        } else {
          setRecipes(null);
        }
      } catch (error) {
        setRecipes(null);
      } finally {
        setLoading(false);
      }
    };

    parseAndSetRecipes();
  }, [id, recipeParam]);

  const handleAddToCart = (recipe) => {
    navigation.navigate('Screens/Cart', { recipe });
  };

  const renderStars = (rating) => {
    const stars = [];
    const maxStars = 5;
    const filledStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = maxStars - filledStars - (halfStar ? 1 : 0);

    for (let i = 0; i < filledStars; i++) {
      stars.push(<Ionicons key={`star-filled-${i}`} name="star" size={20} color="#f4c38d" />);
    }
    if (halfStar) {
      stars.push(<Ionicons key="star-half" name="star-half" size={20} color="#f4c38d" />);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Ionicons key={`star-empty-${i}`} name="star-outline" size={20} color="#f4c38d" />);
    }
    return stars;
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f4c38d" />
        <Text style={{ color: '#f4c38d', marginTop: 10 }}>Loading recipe...</Text>
      </View>
    );
  }

  if (!recipes || recipes.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: '#fff', fontSize: 18 }}>Recipe not found.</Text>
      </View>
    );
  }

  const renderRecipe = ({ item, index }) => {
    return (
      <View key={item.id || index} style={styles.recipeCard}>
        <Image source={{ uri: item.image || AI_PLACEHOLDER_IMAGE }} style={styles.image} />

        {/* Row with cart, comment, star */}
        <View style={styles.iconRow}>
          <TouchableOpacity style={styles.iconWrapper} onPress={() => handleAddToCart(item)}>
            <Ionicons name="cart-outline" size={24} color="#f4c38d" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconWrapper}
            onPress={() => navigation.navigate('Screens/Comment', { recipeId: item.id })}
          >
            <Ionicons name="chatbubble-outline" size={24} color="#f4c38d" />
          </TouchableOpacity>

          <View style={styles.starCircle}>
            <Text style={styles.starMark}>★</Text>
          </View>
        </View>

        <Text style={styles.title}>{item.name || item.title || 'Unnamed Recipe'}</Text>
        <Text style={styles.category}>Category: {item.category || 'Unknown'}</Text>
        <Text style={styles.createdBy}>Created by: {creatorNames[index] || 'Unknown'}</Text>

        <Text style={styles.sectionTitle}>Rating:</Text>
        <View style={styles.inlineRating}>
          {renderStars(item.rating || 0)}
          <Text style={styles.ratingText}>{item.rating ? item.rating.toFixed(1) : 'No rating'}</Text>
        </View>

        <Text style={styles.sectionTitle}>Ingredients:</Text>
        {Array.isArray(item.ingredients) && item.ingredients.length > 0 ? (
          item.ingredients.map((ingredient, i) => (
            <View key={i} style={styles.ingredientItem}>
              <Text style={styles.ingredientText}>
                • {ingredient.ingredientName || ingredient || 'Unnamed'} ({ingredient.ingredientMeasurement || 'N/A'})
              </Text>
            </View>
          ))
        ) : (
          <Text style={{ color: '#fff' }}>No ingredients listed.</Text>
        )}

        <Text style={styles.sectionTitle}>Instructions:</Text>
        <Text style={styles.instructionText}>{item.instructions || 'No instructions provided.'}</Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <FlatList
        data={recipes}
        renderItem={renderRecipe}
        keyExtractor={(item, index) => item.id || index.toString()}
        scrollEnabled={false}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    padding: 20,
  },
  centered: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeCard: {
    marginBottom: 30,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: '#333',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2b2a29',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  iconWrapper: {
    backgroundColor: '#3a3a3a',
    padding: 8,
    borderRadius: 25,
  },
  starCircle: {
    backgroundColor: '#3a3a3a',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  starMark: {
    fontSize: 22,
    color: '#f4c38d',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f4c38d',
    marginBottom: 8,
  },
  ratingContainer: {
    marginBottom: 10,
  },
  inlineRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingText: {
    color: '#f4c38d',
    marginLeft: 6,
    fontWeight: 'bold',
    fontSize: 16,
  },
  category: {
    color: '#d2b48c',
    fontSize: 16,
    marginBottom: 6,
  },
  createdBy: {
    color: '#aaa',
    fontSize: 15,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    color: '#f4c38d',
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  ingredientItem: {
    marginBottom: 6,
  },
  ingredientText: {
    color: '#fff',
    fontSize: 16,
  },
  instructionText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
  },
});
