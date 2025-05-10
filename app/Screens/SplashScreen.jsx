import React, { useEffect, useRef } from "react";
import { View, Image, StyleSheet, Animated } from "react-native";
import {Text} from "react-native";
import { useRouter } from "expo-router"; 
export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity: 0
  const router = useRouter();
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, // Fully visible
      duration: 3000, 
      useNativeDriver: true, // Optimize performance
    }).start(() => {
        // Navigate after animation
        router.replace("/Screens/LandingScreen");
      });
    }, []);
  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../../assets/images/chef 2.png")}
        style={[styles.image, { opacity: fadeAnim }]} // Apply animation
      />
      <Text style={{
      
        position: "absolute",
        fontFamily: "outfit-bold",
        fontSize: 25,
        color: "#fff5e6",
        textAlign: "center",
        width: "100%", // Ensure text stays within the image width
        top: "60%", // Adjust placement on the image
        transform: [{ translateY: -12 }], // Center text better
        
      }}>My Recipes</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#262626",
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
});
