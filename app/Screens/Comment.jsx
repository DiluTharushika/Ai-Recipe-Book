import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

export default function Comment({ username }) {
  const route = useRoute();
  const { recipeId } = route.params || {};

  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmed = comment.trim();

    if (!trimmed) {
      alert('Comment cannot be empty.');
      return;
    }

    if (!recipeId) {
      console.warn('❌ recipeId is missing!');
      alert('Error: Cannot submit comment. Recipe ID is missing.');
      return;
    }

    try {
      setSubmitting(true);

      await addDoc(collection(db, 'comments'), {
        comment: trimmed,
        username: username || 'Anonymous',
        recipeId: recipeId,
        timestamp: serverTimestamp(),
      });

      setComment('');
      alert('✅ Comment added!');
    } catch (error) {
      console.error('Failed to add comment:', error);
      alert('❌ Failed to add comment.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!recipeId) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'red' }}>Error: Recipe ID is missing.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add a Comment</Text>
      <TextInput
        style={styles.input}
        placeholder="Write your comment here..."
        placeholderTextColor="#aaa"
        value={comment}
        onChangeText={setComment}
        multiline
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Submit</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    padding: 20,
  },
  header: {
    fontSize: 22,
    color: '#f4c38d',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#fff',
    backgroundColor: '#2a2a2a',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#f4c38d',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#1e1e1e',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
