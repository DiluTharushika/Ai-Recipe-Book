import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { doc, getDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import Constants from 'expo-constants';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AI_PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x220.png?text=AI+Recipe+Image';
const PIXABAY_API_KEY = Constants.expoConfig.extra.PIXABAY_API_KEY;

export default function RecipeDetail() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id, recipe: recipeParam } = route.params || {};

  const [recipes, setRecipes] = useState(null);
  const [creatorNames, setCreatorNames] = useState([]);
  const [loading, setLoading] = useState(true);

  // Comments and rating states
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [averageCommentRating, setAverageCommentRating] = useState(null);

  const fetchPixabayImage = async (query) => {
    try {
      const response = await fetch(
        `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=3`
      );
      const data = await response.json();
      if (data.hits && data.hits.length > 0) {
        return data.hits[0].webformatURL;
      }
    } catch (error) {
      console.warn('❌ Pixabay image fetch failed:', error);
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
      let parsed;

      if (recipeParam) {
        if (typeof recipeParam === 'string') {
          try {
            parsed = JSON.parse(recipeParam);
          } catch (e) {
            console.warn('❌ Failed to parse recipe param:', e);
            setLoading(false);
            return;
          }
        } else {
          parsed = recipeParam;
        }

        let arr = Array.isArray(parsed) ? parsed : [parsed];

        const updatedRecipes = await Promise.all(
          arr.map(async (recipe) => {
            if (!recipe.image || recipe.image.trim() === '') {
              const fallbackImage = await fetchPixabayImage(recipe.title || recipe.name || 'recipe');
              return { ...recipe, image: fallbackImage || AI_PLACEHOLDER_IMAGE };
            }
            return recipe;
          })
        );

        const creators = await Promise.all(updatedRecipes.map(r => fetchCreatorName(r.createdByUid || r.createdBy)));
        setRecipes(updatedRecipes);
        setCreatorNames(creators);
        setLoading(false);

        // Load comments for first recipe if exists
        if (updatedRecipes.length > 0 && updatedRecipes[0].id) {
          fetchComments(updatedRecipes[0].id);
        }

        return;
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
              (await fetchPixabayImage(fetchedRecipe.title || fetchedRecipe.name || 'recipe')) ||
              AI_PLACEHOLDER_IMAGE;
          }

          const creatorName = await fetchCreatorName(data.createdByUid);

          setRecipes([fetchedRecipe]);
          setCreatorNames([creatorName]);

          // Load comments for this recipe
          fetchComments(fetchedRecipe.id);
        } else {
          setRecipes(null);
        }
      } catch (error) {
        console.warn('Error fetching recipe:', error);
        setRecipes(null);
      } finally {
        setLoading(false);
      }
    };

    parseAndSetRecipes();
  }, [id, recipeParam]);

  // Fetch comments from Firestore for a recipe, and calculate average rating
  const fetchComments = async (recipeId) => {
    setLoadingComments(true);
    try {
      const commentsRef = collection(db, 'comments');
      const q = query(
        commentsRef,
        where('recipeId', '==', recipeId),
        orderBy('timestamp', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const commentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp ? doc.data().timestamp.toDate() : null,
      }));

      setComments(commentsData);

      // Calculate average rating from comments if ratings exist
      const ratings = commentsData
        .map(c => c.rating)
        .filter(r => typeof r === 'number' && r >= 0);
      if (ratings.length > 0) {
        const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
        setAverageCommentRating(avg);
      } else {
        setAverageCommentRating(null);
      }

    } catch (error) {
      console.warn('Error fetching comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  // Refresh handler to reload comments & ratings
  const onRefreshComments = () => {
    if (recipes && recipes[0] && recipes[0].id) {
      fetchComments(recipes[0].id);
    }
  };

  const handleAddToCart = (recipe) => {
    navigation.navigate('Screens/Cart', { recipe });
  };

  const handleGoToComments = (recipeId) => {
    navigation.navigate('Screens/Comment', { recipeId });
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

  // Render one recipe at a time (usually only 1)
  const item = recipes[0];
  const creatorName = creatorNames[0] || 'Unknown';

  return (
    <View style={styles.container}>
      {/* Header with refresh button */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Recipe Details</Text>
        <TouchableOpacity onPress={onRefreshComments} style={styles.refreshButton} accessibilityLabel="Refresh Comments">
          <Ionicons name="refresh" size={28} color="#f4c38d" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.recipeCard}>
          <Image source={{ uri: item.image || AI_PLACEHOLDER_IMAGE }} style={styles.image} />

          <View style={styles.iconRow}>
            <TouchableOpacity style={styles.iconWrapper} onPress={() => handleAddToCart(item)}>
              <Ionicons name="cart-outline" size={24} color="#f4c38d" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconWrapper} onPress={() => handleGoToComments(item.id)}>
              <Ionicons name="chatbubble-outline" size={24} color="#f4c38d" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.starCircle}
              onPress={() => navigation.navigate('Screens/Rating', { recipeId: item.id })}
            >
              <Text style={styles.starMark}>★</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>{item.name || item.title || 'Unnamed Recipe'}</Text>
          <Text style={styles.category}>Category: {item.category || 'Unknown'}</Text>
          <Text style={styles.createdBy}>Created by: {creatorName}</Text>

          <Text style={styles.sectionTitle}>Rating:</Text>
          <View style={styles.inlineRating}>
            {renderStars(averageCommentRating !== null ? averageCommentRating : (item.rating || 0))}
            <Text style={styles.ratingText}>
              {averageCommentRating !== null
                ? averageCommentRating.toFixed(1)
                : item.rating
                ? item.rating.toFixed(1)
                : 'No rating'}
            </Text>
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
          <Text style={styles.instructions}>{item.instructions || 'No instructions provided.'}</Text>

          <Text style={styles.sectionTitle}>Comments and Ratings:</Text>
          {loadingComments ? (
            <ActivityIndicator color="#f4c38d" />
          ) : comments.length === 0 ? (
            <Text style={{ color: '#aaa', fontStyle: 'italic' }}>No comments yet. Be the first!</Text>
          ) : (
            comments.map((comment) => (
              <View key={comment.id} style={styles.commentItem}>
                <Text style={styles.commentUser}>{comment.username || 'Anonymous'}</Text>

                {typeof comment.rating === 'number' && comment.rating >= 0 && (
                  <View style={styles.inlineRating}>
                    {renderStars(comment.rating)}
                    <Text style={[styles.ratingText, { fontSize: 14 }]}>{comment.rating.toFixed(1)}</Text>
                  </View>
                )}

                <Text style={styles.commentText}>{comment.comment}</Text>
                <Text style={styles.commentTime}>
                  {comment.timestamp ? comment.timestamp.toLocaleString() : ''}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222831',
    padding: 10,
    paddingTop:40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#f4c38d',
  },
  refreshButton: {
    padding: 6,
  },
  recipeCard: {
    backgroundColor: '#393e46',
    borderRadius: 8,
    padding: 15,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    marginBottom: 12,
  },
  iconRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  iconWrapper: {
    marginRight: 20,
  },
  starCircle: {
    backgroundColor: '#f4c38d',
    borderRadius: 25,
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  starMark: {
    color: '#222831',
    fontWeight: 'bold',
    fontSize: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f4c38d',
    marginBottom: 5,
  },
  category: {
    fontSize: 16,
    color: '#eaeaea',
    marginBottom: 3,
  },
  createdBy: {
    fontSize: 14,
    color: '#d4c89f',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f4c38d',
    marginVertical: 8,
  },
  inlineRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    marginLeft: 8,
    color: '#f4c38d',
    fontWeight: '600',
  },
  ingredientItem: {
    marginLeft: 10,
    marginBottom: 4,
  },
  ingredientText: {
    color: '#fff',
    fontSize: 14,
  },
  instructions: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  commentItem: {
    backgroundColor: '#2a2f36',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  commentUser: {
    color: '#f4c38d',
    fontWeight: '700',
    marginBottom: 4,
  },
  commentText: {
    color: '#ddd',
    fontSize: 14,
  },
  commentTime: {
    fontSize: 10,
    color: '#888',
    marginTop: 6,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
