import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import RecipeListByCategory from "../components/RecipeListByCategory";
import AutoImageSlider from "../components/AutoImageSlider";
import SearchBar from "../components/SearchBar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("Guest"); // Default to Guest

  return (
    <View style={styles.container}>
      {/* Fixed Header and Search Bar */}
      <View style={styles.fixedHeader}>
        <View style={styles.headerRow}>
          <View style={styles.profileSection}>
            <TouchableOpacity
              style={styles.iconWrapper}
              onPress={() => router.push("/(tabs)/profile")}
            >
              <Ionicons name="person-circle-outline" size={30} color="#adad85" />
            </TouchableOpacity>
            <Text style={styles.greetingText}>Hi, {username}</Text>
          </View>

          <TouchableOpacity
            style={styles.iconWrapper}
            onPress={() => router.push("/Screen02/ShoppingCart")}
          >
            <Ionicons name="cart-outline" size={28} color="#ffaa80" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <AutoImageSlider />
        <SearchBar />
        <RecipeListByCategory />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#262626",
  },
  fixedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#262626",
    zIndex: 10,
    paddingBottom: 10,
  },
  scrollContainer: {
    paddingTop: 120,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 5,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    marginTop: 0,
  },
  greetingText: {
    color: "#D2B48C",
    fontSize: 16,
    paddingTop: 50,
    right: 35,
  },
  iconWrapper: {
    padding: 5,
  },
});
