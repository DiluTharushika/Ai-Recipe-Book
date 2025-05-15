import { View, Text,TextInput, TouchableOpacity, StyleSheet} from 'react-native'
import React, { useState }  from 'react';

const AddAigenerate = () => {
    const [ingredients, setIngredients] = useState('');
    const handleGenerate = () => {
        // You can call your AI function here with the ingredients
        console.log('Generating recipe with:', ingredients);
      };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Recipe Generator</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter ingredients (e.g., rice, chicken)"
        placeholderTextColor="#aaa"
        value={ingredients}
        onChangeText={setIngredients}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleGenerate}>
        <Text style={styles.buttonText}>Generate</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#262626',
      padding: 20,
      justifyContent: 'center',
    },
    title: {
      fontSize: 24,
      color: '#D2B48C',
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    input: {
      backgroundColor: '#363636',
      color: 'white',
      padding: 15,
      borderRadius: 10,
      fontSize: 16,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: '#555',
      minHeight: 100,
      textAlignVertical: 'top',
    },
    button: {
      backgroundColor: '#8B4513',
      paddingVertical: 15,
      borderRadius: 10,
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
  
  export default AddAigenerate;