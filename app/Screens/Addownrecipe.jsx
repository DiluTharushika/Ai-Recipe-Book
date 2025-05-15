import {
  View, Text, TextInput, Button, TouchableOpacity, Image,
  Alert, ScrollView, StyleSheet, TouchableWithoutFeedback,
  KeyboardAvoidingView, Platform, Keyboard, PermissionsAndroid
} from 'react-native';
import React, { useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';

export default function Addownrecipe() {
  const [recipeName, setRecipeName] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [ingredientName, setIngredientName] = useState('');
  const [ingredientMeasurement, setIngredientMeasurement] = useState('');
  const [ingredientCost, setIngredientCost] = useState('');
  const [ingredientsList, setIngredientsList] = useState([]);
  const [instructions, setInstructions] = useState('');

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to your storage to select an image.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'You need to allow access to your photos.');
      return;
    }
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.5,
        includeBase64: false,
      });

      if (result.didCancel) {
        console.log('User cancelled image picker');
      } else if (result.errorMessage) {
        console.log('ImagePicker Error:', result.errorMessage);
        Alert.alert('Error', result.errorMessage);
      } else if (result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
        console.log('Selected Image URI:', result.assets[0].uri);
      } else {
        console.log('Unexpected response:', result);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick an image.');
    }
  };

  const handleAddIngredient = () => {
    if (ingredientName && ingredientMeasurement && ingredientCost) {
      setIngredientsList([...ingredientsList, { ingredientName, ingredientMeasurement, ingredientCost }]);
      setIngredientName('');
      setIngredientMeasurement('');
      setIngredientCost('');
    } else {
      Alert.alert('Error', 'Please fill out all ingredient fields');
    }
  };

  const handleDeleteIngredient = (index) => {
    const updatedList = ingredientsList.filter((_, i) => i !== index);
    setIngredientsList(updatedList);
  };

  const handleSubmit = () => {
    const recipeDetails = {
      name: recipeName,
      image: imageUri,
      ingredients: ingredientsList,
      instructions: instructions,
    };
    console.log(recipeDetails);
    setRecipeName('');
    setImageUri(null);
    setIngredientsList([]);
    setInstructions('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
        >
          <View>
            <Text style={styles.title}>Add Recipe</Text>

            <Text style={styles.label}>Recipe Name:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter recipe name"
              placeholderTextColor="#888"
              value={recipeName}
              onChangeText={setRecipeName}
            />

            <Text style={styles.label}>Recipe Image:</Text>
            <TouchableOpacity onPress={pickImage} style={styles.brownButton}>
              <Text style={styles.buttonText}>{imageUri ? 'Change Image' : 'Pick an Image'}</Text>
            </TouchableOpacity>
            {imageUri && <Image source={{ uri: imageUri }} style={styles.recipeImage} />}

            <Text style={styles.label}>Ingredient Name:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter ingredient name"
              placeholderTextColor="#888"
              value={ingredientName}
              onChangeText={setIngredientName}
            />
            <Text style={styles.label}>Ingredient Measurement:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter measurement"
              placeholderTextColor="#888"
              value={ingredientMeasurement}
              onChangeText={setIngredientMeasurement}
            />
            
            <TouchableOpacity onPress={handleAddIngredient} style={styles.brownButton}>
              <Text style={styles.buttonText}>Add Ingredient</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Ingredients List:</Text>
            {ingredientsList.map((item, index) => (
              <View key={index} style={styles.ingredientRow}>
                <Text style={styles.ingredientText}>{item.ingredientName}</Text>
                <Text style={styles.ingredientText}>{item.ingredientMeasurement}</Text>
                <Text style={styles.ingredientText}>Rs. {item.ingredientCost}</Text>
                <TouchableOpacity onPress={() => handleDeleteIngredient(index)}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))}

            <Text style={styles.label}>Instructions:</Text>
            <TextInput
              style={[styles.input, { height: 100 }]}
              placeholder="Enter recipe instructions"
              placeholderTextColor="#888"
              multiline
              value={instructions}
              onChangeText={setInstructions}
            />

            <TouchableOpacity onPress={handleSubmit} style={styles.brownButton}>
              <Text style={styles.buttonText}>Submit Recipe</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    padding: 20,
  },
  title: {
    color: '#f4c38d',
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    color: '#d2b48c',
    fontSize: 16,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  brownButton: {
    backgroundColor: '#8b5e3c',
    padding: 12,
    marginTop: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  recipeImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  ingredientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  ingredientText: {
    color: '#fff',
    fontSize: 14,
  },
  deleteText: {
    color: 'red',
    fontWeight: 'bold',
  },
});
