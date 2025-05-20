import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import recipes from '../components/RecipeData'; // Import recipe data

const categories = ['All','AI Generated', 'BreakFast', 'Lunch', 'FastFood', 'Dinner', 'Dessert'];

export default function Category() {
  const [likedRecipes, setLikedRecipes] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [aiGeneratedRecipes, setAiGeneratedRecipes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigation = useNavigation(); // Get navigation instance

  const toggleLike = (recipe) => {
    setLikedRecipes((prev) => {
      const updatedLikes = { ...prev, [recipe.id]: !prev[recipe.id] };

      // Update favorites based on the new liked state
      setFavorites((prevFavorites) => {
        const isLiked = updatedLikes[recipe.id]; // Use updated state
        const updatedFavorites = isLiked
          ? [...prevFavorites, recipe] // Add to favorites
          : prevFavorites.filter((fav) => fav.id !== recipe.id); // Remove if unliked

        // Navigate with updated favorites
        navigation.navigate('favourite', { favorites: updatedFavorites });
        return updatedFavorites;
      });

      return updatedLikes;
    });
  };

  const filteredRecipes =
    selectedCategory === 'All'
      ? recipes
      : selectedCategory === 'AI Generated'
      ? aiGeneratedRecipes
      : recipes.filter((recipe) => recipe.category === selectedCategory);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      <FlatList
        data={categories}
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
            {/* Heart Icon Positioned at the Top Right */}
            <TouchableOpacity style={styles.heartIcon} onPress={() => toggleLike(item)}>
              <FontAwesome
                name="heart"
                size={22}
                color={likedRecipes[item.id] ? 'red' : '#999'}
              />
            </TouchableOpacity>

            {/* Large Recipe Image */}
            <TouchableOpacity onPress={() => navigation.navigate('RecipeView', { recipe: item })}>
            <Image source={item.image} style={styles.recipeImage} />
           
            <Text style={styles.recipeName}>{item.name}</Text>
            <Text style={styles.recipeDetails}>{item.details}</Text>
           </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 2,
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
    top: '3%',
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
    backgroundColor:'#333',
    width:30,
    height:30,
    borderRadius: 10,

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
});
