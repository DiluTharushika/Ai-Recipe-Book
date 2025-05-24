import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

export default function RecipeDetail() {
  const route = useRoute();
  const { id } = route.params || {};

  const [recipe, setRecipe] = useState(null);
  const [creatorName, setCreatorName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      console.warn('❌ No recipe ID provided in route params.');
      setLoading(false);
      return;
    }

    const fetchRecipe = async () => {
      try {
        console.log('🔍 Fetching recipe with ID:', id);
        const docRef = doc(db, 'recipes', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log('✅ Recipe found:', data);
          setRecipe({ id: docSnap.id, ...data });

          // ✅ Fetch creator username
          if (data.createdByUid) {
            const userRef = doc(db, 'users', data.createdByUid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              const userData = userSnap.data();
              setCreatorName(userData.username || 'Unknown');
            } else {
              setCreatorName('Unknown');
            }
          } else {
            setCreatorName('Anonymous');
          }
        } else {
          console.warn('❌ No such recipe exists.');
          setRecipe(null);
        }
      } catch (error) {
        console.error('🔥 Error fetching recipe:', error);
        setRecipe(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f4c38d" />
        <Text style={{ color: '#f4c38d', marginTop: 10 }}>
          Loading recipe...
        </Text>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: '#fff', fontSize: 18 }}>Recipe not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {recipe.image ? (
        <Image source={{ uri: recipe.image }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Text style={{ color: '#888' }}>No Image Available</Text>
        </View>
      )}

      <Text style={styles.title}>{recipe.name || 'Unnamed Recipe'}</Text>
      <Text style={styles.category}>
        Category: {recipe.category || 'Unknown'}
      </Text>

      {/* ✅ Show created by username */}
      <Text style={styles.createdBy}>
        Created by: {creatorName}
      </Text>

      <Text style={styles.sectionTitle}>Ingredients:</Text>
      {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 ? (
        recipe.ingredients.map((item, index) => (
          <View key={index} style={styles.ingredientItem}>
            <Text style={styles.ingredientText}>
              • {item.ingredientName || 'Unnamed'} (
              {item.ingredientMeasurement || 'N/A'}) - Rs.
              {item.ingredientCost || '0'}
            </Text>
          </View>
        ))
      ) : (
        <Text style={{ color: '#fff' }}>No ingredients listed.</Text>
      )}

      <Text style={styles.sectionTitle}>Instructions:</Text>
      <Text style={styles.instructionText}>
        {recipe.instructions || 'No instructions provided.'}
      </Text>
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
  image: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 20,
  },
  imagePlaceholder: {
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f4c38d',
    marginBottom: 10,
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
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  ingredientItem: {
    marginBottom: 8,
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
