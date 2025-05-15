import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { router } from "expo-router";

export default function GenerateScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(tabs)/home");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#f4c38d" style={styles.spinner} />
      <Text style={styles.message}>Generating Recipe...</Text>
      <Text style={styles.subMessage}>Please wait a moment</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  spinner: {
    marginBottom: 25,
  },
  message: {
    fontSize: 22,
    color: "#f4c38d",
    fontWeight: "bold",
    marginBottom: 10,
  },
  subMessage: {
    fontSize: 16,
    color: "#ccc",
  },
});
