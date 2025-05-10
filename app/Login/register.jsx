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
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";

const Register = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }
    if (!username || !email || !password) {
      Alert.alert("Error", "Please fill out all fields!");
      return;
    }

    // Simulate successful registration
    Alert.alert("Success", "Account created successfully!");
    router.push("/Login/login");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Confirm Your Password"
              placeholderTextColor="#9E9E9E"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
            />
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
    </TouchableWithoutFeedback>
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

export default Register;
