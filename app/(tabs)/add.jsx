import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../../config/firebaseConfig';

const Add = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [userRecipes, setUserRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleOutsidePress = () => {
    if (showOptions) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    const fetchUserRecipes = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(
          collection(db, 'recipes'),
          where('createdBy', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        const recipes = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserRecipes(recipes);
      } catch (error) {
        console.error('Error fetching user recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRecipes();
  }, []);

  const renderRecipeItem = ({ item }) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() => router.push({ pathname: 'Screens/RecipeView', params: { recipeId: item.id } })}
    >
      <Text style={styles.recipeTitle}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={styles.container}>
        {/* Header with Title and Plus Button */}
        <View style={styles.header}>
          <Text style={styles.title}>My Recipes</Text>
          <TouchableOpacity
            style={styles.plusButton}
            onPress={(e) => {
              e.stopPropagation();
              setShowOptions(!showOptions);
            }}
          >
            <Ionicons name="add" size={28} color="white" />
          </TouchableOpacity>
        </View>

        {/* Options Menu */}
        {showOptions && (
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {
                setShowOptions(false);
                router.push('Screens/Addownrecipe');
              }}
            >
              <Ionicons name="create-outline" size={20} color="white" style={styles.optionIcon} />
              <Text style={styles.optionText}>Own Recipes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {
                setShowOptions(false);
                router.push('Screens/AddAigenerate');
              }}
            >
              <Ionicons name="sparkles" size={18} color="white" style={styles.optionIcon} />
              <Text style={styles.optionText}>AI Generate</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* User Recipes List */}
        {loading ? (
          <ActivityIndicator size="large" color="#ffaa00" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={userRecipes}
            keyExtractor={(item) => item.id}
            renderItem={renderRecipeItem}
            contentContainerStyle={{ paddingTop: 10 }}
            ListEmptyComponent={
              <Text style={styles.noRecipesText}>You haven't added any recipes yet.</Text>
            }
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#262626',
    padding: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#D2B48C',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  plusButton: {
    backgroundColor: '#8B4513',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  optionsContainer: {
    position: 'absolute',
    right: 20,
    top: 70,
    backgroundColor: '#363636',
    borderRadius: 8,
    paddingVertical: 8,
    width: 180,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    borderWidth: 1,
    borderColor: '#454545',
    zIndex: 10,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionIcon: {
    marginRight: 12,
  },
  optionText: {
    color: 'white',
    fontSize: 16,
  },
  recipeCard: {
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
  },
  recipeTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  noRecipesText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Add;
