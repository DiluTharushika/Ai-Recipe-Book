import { View, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import LandingScreen from "./Screens/LandingScreen";
import SplashScreen from "./Screens/SplashScreen";

export default function Index() {
  const [isShowSplash, setIsShowSplash] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShowSplash(false);
    }, 3000); // Show splash for 3 seconds

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <>
      {isShowSplash ? <SplashScreen /> : <LandingScreen />}
    </>
  );
}