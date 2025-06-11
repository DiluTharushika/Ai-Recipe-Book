import React, { useEffect, useState } from 'react';
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
import {
  addDoc,
  collection,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  orderBy,
} from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

export default function Comment({ username }) {
  const route = useRoute();
  const { recipeId } = route.params || {};

  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!recipeId) return;

    const q = query(
      collection(db, 'comments'),
      where('recipeId', '==', recipeId),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedComments = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate(), // Convert Firestore timestamp
        };
      });
      setComments(fetchedComments);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [recipeId]);

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
    } catch (error) {
      console.error('Failed to add comment:', error);
      alert('❌ Failed to add comment.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimestamp = (date) => {
    if (!date) return '';
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  };

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

      <Text style={[styles.header, { marginTop: 30 }]}>Comments</Text>

      {loading ? (
        <ActivityIndicator color="#f4c38d" />
      ) : (
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.commentBox}>
              <View style={styles.commentHeader}>
                <Text style={styles.commentUser}>{item.username}</Text>
                <Text style={styles.commentTime}>{formatTimestamp(item.timestamp)}</Text>
              </View>
              <Text style={styles.commentText}>{item.comment}</Text>
            </View>
          )}
        />
      )}
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
  commentBox: {
    backgroundColor: '#2a2a2a',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  commentUser: {
    color: '#f4c38d',
    fontWeight: 'bold',
  },
  commentTime: {
    color: '#aaa',
    fontSize: 12,
  },
  commentText: {
    color: '#fff',
  },
});
