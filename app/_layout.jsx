import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { ActivityIndicator } from "react-native";
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    outfit: require("./../assets/fonts/Outfit-Regular.ttf"),
    "outfit-medium": require("./../assets/fonts/Outfit-Medium.ttf"),
    "outfit-bold": require("./../assets/fonts/Outfit-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" />;
  }

  return (
    
    <Stack>
      <Stack.Screen name="Screens/SplashScreen" options={{ headerShown: false }} />
      <Stack.Screen name="Screens/LandingScreen" options={{ headerShown: false }} />
      <Stack.Screen name="Login/login" options={{ headerShown: false }} />
      <Stack.Screen name="Login/register" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="Screens/Addownrecipe" options={{ headerShown: false }} />
   <Stack.Screen name="Screens/AddAigenerate" options={{ headerShown: false }} />
   <Stack.Screen name="Screens/Cart" options={{ headerShown: false }} />
   <Stack.Screen name="Screens/AboutApp" options={{ headerShown: false }} />
   <Stack.Screen name="Screens/RecipeGenerator01" options={{ headerShown: false }} />
   <Stack.Screen name="Screens/RecipeGenerator02" options={{ headerShown: false }} />
   <Stack.Screen name="Screens/RecipeGenerator03" options={{ headerShown: false }} />
   <Stack.Screen name="Screens/GenerateScreen" options={{ headerShown: false }} />
   </Stack>
   
  );
}
