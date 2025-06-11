import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Image,
  Alert, ScrollView, StyleSheet, TouchableWithoutFeedback,
  KeyboardAvoidingView, Platform, Keyboard, Animated
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { db, auth } from '../../config/firebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import { uploadImageToCloudinary } from '../../config/cloudinary';

export default function Addownrecipe() {
  const [recipeName, setRecipeName] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [ingredientName, setIngredientName] = useState('');
  const [ingredientMeasurement, setIngredientMeasurement] = useState('');
  const [ingredientCost, setIngredientCost] = useState('');
  const [ingredientsList, setIngredientsList] = useState([]);
  const [instructions, setInstructions] = useState('');

  // Animation refs
  const slideAnim = useRef(new Animated.Value(0)).current; // for keyboard show/hide shifting
  const logoOpacity = useRef(new Animated.Value(1)).current; // title opacity on keyboard
  const fadeInAnim = useRef(new Animated.Value(0)).current; // fade in for whole content

  // Animated values for each input/button for stagger effect
  const animValues = useRef(
    Array(12)
      .fill()
      .map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    // Animate content fade-in on mount
    Animated.timing(fadeInAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Stagger fade + slide up for inputs/buttons
    Animated.stagger(
      100,
      animValues.map(animValue =>
        Animated.timing(animValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        })
      )
    ).start();

    // Keyboard listeners to slide up content and fade out title
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const requestPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera roll permissions are required.');
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
        try {
          const uploadedUrl = await uploadImageToCloudinary(localUri);
          setImageUrl(uploadedUrl);
          Alert.alert('Success', 'Image uploaded successfully');
        } catch (uploadError) {
          console.error('Upload error:', uploadError);
          Alert.alert('Upload Failed', 'Image upload failed.');
        }
      }
    } catch (error) {
      console.error('Image picking error:', error);
      Alert.alert('Error', 'Image selection failed.');
    }
  };

  const handleAddIngredient = () => {
    if (ingredientName && ingredientMeasurement && ingredientCost) {
      setIngredientsList([
        ...ingredientsList,
        { ingredientName, ingredientMeasurement, ingredientCost },
      ]);
      setIngredientName('');
      setIngredientMeasurement('');
      setIngredientCost('');
    } else {
      Alert.alert('Error', 'Please fill all ingredient fields.');
    }
  };

  const handleDeleteIngredient = index => {
    const updatedList = ingredientsList.filter((_, i) => i !== index);
    setIngredientsList(updatedList);
  };

  const handleSubmit = async () => {
    if (!recipeName || !category || ingredientsList.length === 0 || !instructions) {
      Alert.alert('Error', 'All fields are required.');
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
      createdBy: user.uid,
      createdAt: Timestamp.now(),
    };

    try {
      await addDoc(collection(db, 'recipes'), recipeDetails);
      Alert.alert('Success', 'Recipe added successfully.');
      setRecipeName('');
      setCategory('');
      setImageUrl(null);
      setIngredientsList([]);
      setInstructions('');
    } catch (error) {
      console.error('Add recipe error:', error);
      Alert.alert('Error', 'Failed to add recipe.');
    }
  };

  // Helper function to create animated style for fade and slide
  const getAnimatedStyle = index => ({
    opacity: animValues[index],
    transform: [
      {
        translateY: animValues[index].interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0], // slide up on fade in
        }),
      },
    ],
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Animated.View style={[styles.titleContainer, { opacity: logoOpacity, transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.title}>Add Recipe</Text>
          </Animated.View>

          <Animated.View style={[getAnimatedStyle(0)]}>
            <Text style={styles.label}>Recipe Name:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter recipe name"
              placeholderTextColor="#888"
              value={recipeName}
              onChangeText={setRecipeName}
            />
          </Animated.View>

          <Animated.View style={[getAnimatedStyle(1)]}>
            <Text style={styles.label}>Category:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={category}
                onValueChange={setCategory}
                style={styles.picker}
              >
                <Picker.Item label="Select category" value="" />
                <Picker.Item label="Breakfast" value="breakfast" />
                <Picker.Item label="Lunch" value="lunch" />
                <Picker.Item label="Dinner" value="dinner" />
                <Picker.Item label="Fast Food" value="fastfood" />
                <Picker.Item label="Dessert" value="dessert" />
              </Picker>
            </View>
          </Animated.View>

          <Animated.View style={[getAnimatedStyle(2)]}>
            <Text style={styles.label}>Recipe Image:</Text>
            <TouchableOpacity onPress={pickImage} style={styles.brownButton}>
              <Text style={styles.buttonText}>{imageUrl ? 'Change Image' : 'Pick an Image'}</Text>
            </TouchableOpacity>
            {imageUrl && <Image source={{ uri: imageUrl }} style={styles.recipeImage} />}
          </Animated.View>

          <Animated.View style={[getAnimatedStyle(3)]}>
            <Text style={styles.label}>Ingredient Name:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter ingredient name"
              placeholderTextColor="#888"
              value={ingredientName}
              onChangeText={setIngredientName}
            />
          </Animated.View>

          <Animated.View style={[getAnimatedStyle(4)]}>
            <Text style={styles.label}>Measurement:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter measurement"
              placeholderTextColor="#888"
              value={ingredientMeasurement}
              onChangeText={setIngredientMeasurement}
            />
          </Animated.View>

          <Animated.View style={[getAnimatedStyle(5)]}>
            <Text style={styles.label}>Cost (Rs.):</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter cost"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={ingredientCost}
              onChangeText={setIngredientCost}
            />
          </Animated.View>

          <Animated.View style={[getAnimatedStyle(6)]}>
            <TouchableOpacity onPress={handleAddIngredient} style={styles.brownButton}>
              <Text style={styles.buttonText}>Add Ingredient</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[getAnimatedStyle(7)]}>
            <Text style={styles.label}>Ingredients List:</Text>
            {ingredientsList.map((item, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.ingredientRow,
                  {
                    opacity: animValues[8].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1],
                    }),
                    transform: [
                      {
                        translateY: animValues[8].interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Text style={styles.ingredientText}>{item.ingredientName}</Text>
                <Text style={styles.ingredientText}>{item.ingredientMeasurement}</Text>
                <Text style={styles.ingredientText}>Rs. {item.ingredientCost}</Text>
                <TouchableOpacity onPress={() => handleDeleteIngredient(index)}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </Animated.View>

          <Animated.View style={[getAnimatedStyle(9)]}>
            <Text style={styles.label}>Instructions:</Text>
            <TextInput
              style={[styles.input, { height: 100 }]}
              placeholder="Enter instructions"
              placeholderTextColor="#888"
              multiline
              value={instructions}
              onChangeText={setInstructions}
            />
          </Animated.View>

          <Animated.View style={[getAnimatedStyle(10)]}>
            <TouchableOpacity onPress={handleSubmit} style={styles.brownButton}>
              <Text style={styles.buttonText}>Submit Recipe</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, backgroundColor: '#1e1e1e', padding: 20 },
  titleContainer: { marginBottom: 20 },
  title: { color: '#f4c38d', fontSize: 28, fontWeight: 'bold', textAlign: 'center' },
  label: { color: '#d2b48c', fontSize: 16, marginTop: 10 },
  input: { backgroundColor: '#333', color: '#fff', padding: 10, borderRadius: 10, marginTop: 5 },
  brownButton: { backgroundColor: '#8b5e3c', padding: 12, marginTop: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  recipeImage: { width: '100%', height: 200, borderRadius: 10, marginTop: 10 },
  ingredientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  ingredientText: { color: '#fff', fontSize: 14 },
  deleteText: { color: 'red', fontWeight: 'bold' },
  pickerContainer: { backgroundColor: '#333', borderRadius: 10, marginTop: 5 },
  picker: { color: '#fff' },
});
