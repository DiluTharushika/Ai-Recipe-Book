import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function menu() {
  const router = useRouter();

  const handleLogout = () => {
    console.log("Logging out...");
    // Firebase logout can be added here later
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu</Text>

      <TouchableOpacity style={styles.item} onPress={() => router.push("/(tabs)/profile")}>
        <Ionicons name="person-outline" size={20} color="#fff" />
        <Text style={styles.label}>Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.item,styles.logoutItem]} onPress={() => router.push("/(tabs)/favourite")} >
        <Ionicons name="heart-outline" size={20} color="#fff" />
        <Text style={styles.label}>Favorites</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.item,styles.logoutItem]} onPress={() => router.push("/Screen02/ShoppingCart")}>
        <Ionicons name="cart-outline" size={20} color="#fff" />
        <Text style={styles.label}>Shopping Cart</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.item,styles.logoutItem]} >
        <Ionicons name="share-social-outline" size={20} color="#fff" />
        <Text style={styles.label}>Share App</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.item,styles.logoutItem]} onPress={() => router.push("/Screen02/AboutApp")} >
        <Ionicons name="information-circle-outline" size={20} color="#fff" />
        <Text style={styles.label}>About App</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.item, styles.logoutItem]} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.label}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#262626',
    padding: 20,

  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D2B48C',
    marginBottom: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  label: {
    marginLeft: 10,
    color: '#fff',
    fontSize: 16,
  },
  logoutItem: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#444',
    paddingTop: 20,
  },
});
