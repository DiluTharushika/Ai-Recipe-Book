import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React from 'react';

export default function AboutApp() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>About App</Text>

      <Text style={styles.appName}>🍽️ Smart Recipe App</Text>
      <Text style={styles.description}>
        AI-powered meal planning, recipe creation, and shopping list features — all in one place!
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📱 Version</Text>
        <Text style={styles.sectionText}>1.0.0</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👩‍💻 Developer</Text>
        <Text style={styles.sectionText}>Dilu Tharushika</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔧 Technologies</Text>
        <Text style={styles.sectionText}>React Native, Expo, Firebase, AI</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📬 Contact</Text>
        <Text style={styles.sectionText}>dilu@example.com</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🙏 Special Thanks</Text>
        <Text style={styles.sectionText}>Thanks to all open-source contributors and design inspirations.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#262626',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#b35900',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  appName: {
    fontSize: 20,
    color: '#D2B48C',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#D2B48C',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sectionText: {
    fontSize: 14,
    color: '#ccc',
  },
});
