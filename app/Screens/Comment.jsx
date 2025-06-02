import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { db } from '../../config/firebaseConfig';
import { addDoc, collection, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { useRoute } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';

const Comment = () => {
  const route = useRoute();
  const { recipeId } = route.params || {};
  const auth = getAuth();

  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  const handleAddComment = async () => {
    const user = auth.currentUser;
    if (!comment.trim() || !user || !recipeId) return;

    try {
      await addDoc(collection(db, 'comments'), {
        text: comment.trim(),
        recipeId,
        userId: user.uid,
        userName: user.displayName || user.email || 'Anonymous',
        createdAt: serverTimestamp(),
      });
      setComment('');
    } catch (error) {
      console.warn('❌ Failed to add comment:', error);
    }
  };

  useEffect(() => {
    if (!recipeId) return;

    const q = query(
      collection(db, 'comments'),
      where('recipeId', '==', recipeId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedComments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(fetchedComments);
    });

    return () => unsubscribe();
  }, [recipeId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comments</Text>

      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.commentItem}>
            <Text style={styles.commentUser}>{item.userName}</Text>
            <Text style={styles.commentText}>{item.text}</Text>
          </View>
        )}
      />

      <TextInput
        placeholder="Add a comment..."
        value={comment}
        onChangeText={setComment}
        style={styles.input}
        placeholderTextColor="#999"
      />
      <TouchableOpacity style={styles.button} onPress={handleAddComment}>
        <Text style={styles.buttonText}>Submit Comment</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Comment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    padding: 20,
  },
  title: {
    fontSize: 22,
    color: '#f4c38d',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  commentItem: {
    marginBottom: 12,
    backgroundColor: '#2a2a2a',
    padding: 12,
    borderRadius: 8,
  },
  commentUser: {
    color: '#f4c38d',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  commentText: {
    color: '#fff',
    fontSize: 16,
  },
  input: {
    backgroundColor: '#2a2a2a',
    padding: 12,
    borderRadius: 8,
    color: '#fff',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#f4c38d',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#1e1e1e',
    fontWeight: 'bold',
  },
});
