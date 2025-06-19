import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const Add = () => {
  const [showOptions, setShowOptions] = useState(false);

  const handleOutsidePress = () => {
    if (showOptions) {
      setShowOptions(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Recipes</Text>
          <TouchableOpacity
            style={styles.plusButton}
            onPress={(e) => {
              e.stopPropagation();
              setShowOptions(!showOptions);
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={32} color="white" />
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

        {/* Placeholder when no recipes exist */}
        <View style={styles.placeholderContainer}>
          <Ionicons name="restaurant-outline" size={60} color="#888" style={{ marginBottom: 10 }} />
          <Text style={styles.placeholderText}>
            No recipes found. Use the + button to create your own or let AI cook for you!
          </Text>
        </View>
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
    width: 54,              // bigger button
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,

    // Highlight Glow:
    shadowColor: '#FFD700', // gold glow color
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 10,          // for Android shadow
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  optionsContainer: {
    position: 'absolute',
    right: 20,
    top: 80,
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
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
});

export default Add;
