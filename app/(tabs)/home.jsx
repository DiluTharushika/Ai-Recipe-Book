import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import AutoImageSlider from "../components/AutoImageSlider";
import SearchBar from "../components/SearchBar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { auth, db } from "../../config/firebaseConfig";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import Category from "../components/Category";

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("Guest");
  const [refreshing, setRefreshing] = useState(false);
  const [allRecipes, setAllRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ Added

  const fetchUsername = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUsername(data.username || "User");
        }
      }
    } catch (error) {
      console.log("Error fetching username:", error);
    }
  };

  const fetchRecipes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "recipes"));
      const recipeList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllRecipes(recipeList);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([fetchUsername(), fetchRecipes()]).finally(() =>
      setRefreshing(false)
    );
  }, []);

  useEffect(() => {
    fetchUsername();
    fetchRecipes();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
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
            onPress={() => router.push("/Screens/Cart")}
          >
            <Ionicons name="cart-outline" size={28} color="#ffaa80" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Content with Pull-to-Refresh */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <AutoImageSlider />
        <SearchBar onSearch={setSearchQuery} /> {/* ✅ Pass onSearch properly */}
        <Category recipes={allRecipes} searchQuery={searchQuery} /> {/* ✅ Pass searchQuery */}
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
    top: 12,
    left: 0,
    right: 0,
    backgroundColor: "#262626",
    zIndex: 10,
    paddingBottom: 0,
  },
  scrollContainer: {
    paddingTop: 120,
    paddingHorizontal: 7,
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
    marginLeft: 8,
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
