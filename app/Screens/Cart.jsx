import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRoute } from '@react-navigation/native';

const AI_PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x220.png?text=AI+Recipe+Image';

const Cart = () => {
  const route = useRoute();
  const newRecipe = route.params?.recipe;

  const [cartRecipes, setCartRecipes] = useState([]);
  const [expandedRecipeId, setExpandedRecipeId] = useState(null);

  useEffect(() => {
    if (newRecipe) {
      setCartRecipes(prevRecipes => {
        if (!prevRecipes.some(r => r.id === newRecipe.id)) {
          return [...prevRecipes, newRecipe];
        }
        return prevRecipes;
      });
    }
  }, [newRecipe]);

  if (cartRecipes.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Your cart is empty.</Text>
      </View>
    );
  }

  const renderIngredients = (ingredients) => {
    if (!ingredients || ingredients.length === 0) return null;

    return ingredients.map((ing, idx) => {
      if (typeof ing === 'object') {
        // Safely convert ingredientCost to number and fallback to 0
        const costNum = Number(ing.ingredientCost);
        const displayCost = isNaN(costNum) ? 0 : costNum;

        return (
          <Text key={idx} style={styles.ingredientItem}>
            • {ing.ingredientMeasurement ? `${ing.ingredientMeasurement} ` : ''}
            {ing.ingredientName || ''} - Rs. {displayCost.toFixed(2)}
          </Text>
        );
      } else if (typeof ing === 'string') {
        return (
          <Text key={idx} style={styles.ingredientItem}>
            • {ing}
          </Text>
        );
      }
      return null;
    });
  };

  const getTotalCost = (ingredients) => {
    if (!ingredients || ingredients.length === 0) return 0;
    return ingredients.reduce((total, ing) => {
      const cost = parseFloat(ing.ingredientCost);
      return total + (isNaN(cost) ? 0 : cost);
    }, 0);
  };

  const handleToggleExpand = (id) => {
    setExpandedRecipeId(prevId => (prevId === id ? null : id));
  };

  const renderItem = ({ item }) => {
    const totalCost = getTotalCost(item.ingredients);

    return (
      <TouchableOpacity
        onPress={() => handleToggleExpand(item.id)}
        activeOpacity={0.8}
        style={[styles.recipeCard, expandedRecipeId === item.id && styles.expandedCard]}
      >
        <Image
          source={{ uri: item.image || AI_PLACEHOLDER_IMAGE }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.name || item.title || 'Unnamed Recipe'}</Text>
          <Text style={styles.category}>Category: {item.category || 'Unknown'}</Text>
          <Text style={styles.totalCost}>Total Cost: Rs. {totalCost.toFixed(2)}</Text>

          {expandedRecipeId === item.id && (
            <View style={styles.ingredientsContainer}>
              <Text style={styles.sectionTitle}>Ingredients:</Text>
              {renderIngredients(item.ingredients)}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      style={styles.container}
      data={cartRecipes}
      keyExtractor={(item, index) => item.id || index.toString()}
      renderItem={renderItem}
      ListHeaderComponent={<Text style={styles.header}>Recipes in Cart</Text>}
      contentContainerStyle={{ paddingBottom: 30 }}
    />
  );
};

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
  emptyText: {
    color: '#f4c38d',
    fontSize: 20,
  },
  header: {
    color: '#f4c38d',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  recipeCard: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#2c2c2c',
    borderRadius: 12,
    overflow: 'hidden',
  },
  expandedCard: {
    backgroundColor: '#3a3a3a',
  },
  image: {
    width: 120,
    height: 120,
  },
  textContainer: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  title: {
    color: '#f4c38d',
    fontSize: 20,
    fontWeight: 'bold',
  },
  category: {
    color: '#d2b48c',
    fontSize: 16,
    marginTop: 6,
  },
  totalCost: {
    color: '#e0a756',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 6,
  },
  ingredientsContainer: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f0d9a6',
    marginBottom: 6,
  },
  ingredientItem: {
    color: '#ddd',
    fontSize: 16,
    marginLeft: 10,
    marginBottom: 4,
  },
});

export default Cart;
