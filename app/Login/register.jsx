import {
  SafeAreaView,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../config/firebaseConfig";
import { Feather } from "@expo/vector-icons";

const Register = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill out all fields!");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: email,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Success", "Account created successfully!");
      router.push("/Login/login");
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert("Registration Failed", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#262626" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          style={{ backgroundColor: "#262626" }}
        >
          <SafeAreaView style={styles.container}>
            <View style={styles.logoContainer}>
              <Image source={require("../../assets/images/chef 2.png")} style={styles.logo} />
              <Text style={styles.logoText}>My Recipes</Text>
            </View>

            <View style={styles.contentContainer}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Sign up to get started</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter Your Username"
                  placeholderTextColor="#9E9E9E"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="words"
                />
              </View>

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
                <View style={styles.passwordInputWrapper}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter Your Password"
                    placeholderTextColor="#9E9E9E"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="#555" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.passwordInputWrapper}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Confirm Your Password"
                    placeholderTextColor="#9E9E9E"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Feather name={showConfirmPassword ? "eye-off" : "eye"} size={20} color="#555" />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>

              <Text style={styles.registerText}>
                Already have an account?{" "}
                <Text style={styles.registerLink} onPress={() => router.push("/Login/login")}>
                  Sign in
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
    paddingHorizontal: 20,
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
  },
  contentContainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: 70,
  },
  title: {
    fontSize: 38,
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
    paddingRight: 40,
  },
  passwordInputWrapper: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 12,
  },
  button: {
    backgroundColor: "#8B4513",
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

export default Register;
