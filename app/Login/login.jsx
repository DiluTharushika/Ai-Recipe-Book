import {
  SafeAreaView,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebaseConfig"; // make sure this path is correct

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Logged in:", user.email);
      router.replace("/Screens/RecipeGenerator01");
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Login Failed", error.message);
    }
  };

  const navigateToSignUp = () => {
    router.push("/Login/register");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#262626" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, backgroundColor: "#262626" }}
          keyboardShouldPersistTaps="handled"
          style={{ backgroundColor: "#262626" }}
        >
          <SafeAreaView style={styles.container}>
            <View style={styles.logoContainer}>
              <Image
                source={require("../../assets/images/chef 2.png")}
                style={styles.logo}
              />
              <Text style={styles.logoText}>My Recipes</Text>
            </View>

            <View style={styles.contentContainer}>
              <Text style={styles.title}>Welcome!!</Text>
              <Text style={styles.subtitle}>Sign in to continue</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter Your Email"
                  placeholderTextColor="#9E9E9E"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter Your Password"
                  placeholderTextColor="#9E9E9E"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Sign in</Text>
              </TouchableOpacity>

              <Text style={styles.registerText}>
                Don't have an account?{" "}
                <Text style={styles.registerLink} onPress={navigateToSignUp}>
                  Register
                </Text>
              </Text>
            </View>
          </SafeAreaView>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#262626",
    padding: 10,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
    position: "absolute",
    top: 50,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  logoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff5e6",
    marginTop: 10,
    fontFamily: "outfit-bold",
    position: "absolute",
    textAlign: "center",
    width: "100%",
    top: "94%",
    transform: [{ translateY: -12 }],
  },
  contentContainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: 70,
    
  },
  title: {
    fontSize: 47,
    fontWeight: "bold",
    color: "#ffb84d",
    marginBottom: 5,
    fontFamily: "outfit-bold",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(163, 162, 159, 0.78)",
    marginBottom: 20,
    fontFamily: "outfit",
  },
  inputContainer: {
    marginBottom: 15,
    width: "90%",
  },
  label: {
    fontSize: 14,
    color: "#FFFFFF",
    marginBottom: 6,
    fontFamily: "outfit",
  },
  textInput: {
    height: 44,
    borderWidth: 2,
    borderColor: "#FF9900",
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#ffebcc",
    color: "#000",
  },
  button: {
    backgroundColor: "#FF9900",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
    height: 44,
    width: "90%",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerText: {
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 10,
    fontFamily: "outfit",
  },
  registerLink: {
    color: "#FF9900",
    fontWeight: "bold",
    fontFamily: "outfit-bold",
  },
});

export default Login;
