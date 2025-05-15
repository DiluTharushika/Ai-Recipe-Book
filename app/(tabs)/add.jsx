import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  TouchableWithoutFeedback 
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
          <View 
            style={styles.optionsContainer}
            onStartShouldSetResponder={() => true}
          >
            <TouchableOpacity 
              style={styles.optionButton}
              onPress={() => {
                setShowOptions(false);
                router.push("Screens/Addownrecipe");
              }}
            >
              <Ionicons name="create-outline" size={20} color="white" style={styles.optionIcon} />
              <Text style={styles.optionText}>Own Recipes</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.optionButton}
              onPress={() =>{
                 setShowOptions(false);
              router.push("Screens/AddAigenerate");
              }}
            >
              <Ionicons name="sparkles" size={18} color="white" style={styles.optionIcon} />
              <Text style={styles.optionText}>AI Generate</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#262626',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
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
});

export default Add;