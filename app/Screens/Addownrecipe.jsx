import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Image,
  Alert, ScrollView, StyleSheet, TouchableWithoutFeedback,
  KeyboardAvoidingView, Platform, Keyboard
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { db, auth } from '../../config/firebaseConfig'; // ✅ Import auth here
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import { uploadImageToCloudinary } from '../../config/cloudinary'; // Your upload function

export default function Addownrecipe() {
  const [recipeName, setRecipeName] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [ingredientName, setIngredientName] = useState('');
  const [ingredientMeasurement, setIngredientMeasurement] = useState('');
  const [ingredientCost, setIngredientCost] = useState('');
  const [ingredientsList, setIngredientsList] = useState([]);
  const [instructions, setInstructions] = useState('');

  const requestPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
        return false;
      }
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled) {
        const localUri = result.assets[0].uri;
        // Upload to Cloudinary
        try {
          const uploadedUrl = await uploadImageToCloudinary(localUri);
          setImageUrl(uploadedUrl);
          Alert.alert('Success', 'Image uploaded successfully');
        } catch (uploadError) {
          console.error('Cloudinary upload error:', uploadError);
          Alert.alert('Upload Failed', 'Failed to upload image to Cloudinary');
        }
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

  const handleSubmit = async () => {
    if (!recipeName || !category || ingredientsList.length === 0 || !instructions) {
      Alert.alert('Error', 'Please fill in all fields including category before submitting.');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'User not authenticated.');
      return;
    }

    const recipeDetails = {
      name: recipeName,
      category,
      image: imageUrl || '',
      ingredients: ingredientsList,
      instructions,
      createdBy: user.uid, // ✅ Added this field
      createdAt: Timestamp.now(),
    };

    try {
      await addDoc(collection(db, 'recipes'), recipeDetails);
      Alert.alert('Success', 'Recipe added successfully!');
      // Reset form
      setRecipeName('');
      setCategory('');
      setImageUrl(null);
      setIngredientsList([]);
      setInstructions('');
    } catch (error) {
      console.error('Error adding recipe:', error);
      Alert.alert('Error', 'Failed to add recipe');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}>
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

            <Text style={styles.label}>Category:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={category}
                onValueChange={(itemValue) => setCategory(itemValue)}
                style={styles.picker}
                prompt="Select Category"
              >
                <Picker.Item label="Select category" value="" />
                <Picker.Item label="Breakfast" value="breakfast" />
                <Picker.Item label="Lunch" value="lunch" />
                <Picker.Item label="Dinner" value="dinner" />
                <Picker.Item label="Fast Food" value="fastfood" />
                <Picker.Item label="Dessert" value="dessert" />
              </Picker>
            </View>

            <Text style={styles.label}>Recipe Image:</Text>
            <TouchableOpacity onPress={pickImage} style={styles.brownButton}>
              <Text style={styles.buttonText}>{imageUrl ? 'Change Image' : 'Pick an Image'}</Text>
            </TouchableOpacity>
            {imageUrl && <Image source={{ uri: imageUrl }} style={styles.recipeImage} />}

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

            <Text style={styles.label}>Ingredient Cost (Rs.):</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter cost"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={ingredientCost}
              onChangeText={setIngredientCost}
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
  container: { flex: 1, backgroundColor: '#1e1e1e', padding: 20 },
  title: { color: '#f4c38d', fontSize: 25, fontWeight: 'bold', marginBottom: 10 },
  label: { color: '#d2b48c', fontSize: 16, marginTop: 10 },
  input: { backgroundColor: '#333', color: '#fff', padding: 10, borderRadius: 10, marginTop: 5 },
  brownButton: { backgroundColor: '#8b5e3c', padding: 12, marginTop: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  recipeImage: { width: '100%', height: 200, borderRadius: 10, marginTop: 10 },
  ingredientRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: '#444' },
  ingredientText: { color: '#fff', fontSize: 14 },
  deleteText: { color: 'red', fontWeight: 'bold' },
  pickerContainer: { backgroundColor: '#333', borderRadius: 10, marginTop: 5 },
  picker: { color: '#fff' },
});
