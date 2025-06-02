import { Stack, Redirect } from "expo-router";
import { useFonts } from "expo-font";
import { ActivityIndicator, View } from "react-native";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebaseConfig"; // Adjust path as needed
import { RecipeProvider } from "../context/RecipeContext";
import { CartProvider } from '../context/CartContext';
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    outfit: require("../assets/fonts/Outfit-Regular.ttf"),
    "outfit-medium": require("../assets/fonts/Outfit-Medium.ttf"),
    "outfit-bold": require("../assets/fonts/Outfit-Bold.ttf"),
  });

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  if (!fontsLoaded || authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#FF9900" />
      </View>
    );
  }

  return (
    <CartProvider>
     <RecipeProvider>
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* If user is logged in, redirect to your protected routes */}
      {user ? (
        <>
          {/* Redirect to your main tab screen or home screen */}
          <Redirect href="/Screens/RecipeGenerator01" />
        </>
      ) : (
        <>
          {/* Redirect to the landing/login flow */}
          <Redirect href="/Screens/LandingScreen" />
        </>
      )}
    </Stack>
    </RecipeProvider>
    </CartProvider>
  );
}
