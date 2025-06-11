import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { doc, getDoc, updateDoc, runTransaction } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

export default function Rating() {
  const route = useRoute();
  const navigation = useNavigation();
  const { recipeId } = route.params;

  const [currentRating, setCurrentRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchCurrentRating() {
      if (!recipeId) {
        Alert.alert('Error', 'No recipe ID provided');
        navigation.goBack();
        return;
      }
      try {
        const docRef = doc(db, 'recipes', recipeId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCurrentRating(data.rating || 0);
          setSelectedRating(data.rating || 0);
        } else {
          Alert.alert('Error', 'Recipe not found');
          navigation.goBack();
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch rating');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    }

    fetchCurrentRating();
  }, [recipeId, navigation]);

  const submitRating = async () => {
    if (selectedRating < 1 || selectedRating > 5) {
      Alert.alert('Invalid Rating', 'Please select a rating between 1 and 5 stars.');
      return;
    }
    setSubmitting(true);
    try {
      // You can either overwrite rating or implement an average rating logic here
      // Here: we overwrite with selectedRating for simplicity
      const docRef = doc(db, 'recipes', recipeId);

      await updateDoc(docRef, {
        rating: selectedRating,
      });

      Alert.alert('Success', 'Rating submitted!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to submit rating.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (ratingValue, onPressStar) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => onPressStar(i)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={i <= ratingValue ? 'star' : 'star-outline'}
            size={40}
            color="#f4c38d"
            style={{ marginHorizontal: 6 }}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f4c38d" />
        <Text style={{ color: '#f4c38d', marginTop: 10 }}>Loading rating...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rate this Recipe</Text>

      <View style={styles.starsRow}>
        {renderStars(selectedRating, setSelectedRating)}
      </View>

      <TouchableOpacity
        style={[styles.submitButton, submitting && { opacity: 0.6 }]}
        onPress={submitRating}
        disabled={submitting}
      >
        <Text style={styles.submitButtonText}>{submitting ? 'Submitting...' : 'Submit Rating'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  centered: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f4c38d',
    marginBottom: 30,
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  submitButton: {
    backgroundColor: '#f4c38d',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e1e1e',
  },
});
