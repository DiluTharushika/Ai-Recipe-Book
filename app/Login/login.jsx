// Your imports
import {
  SafeAreaView,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";
import * as Animatable from "react-native-animatable";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Modal from "react-native-modal";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const showCustomAlert = (message, success = false, onClose = () => {}) => {
    setModalMessage(message);
    setIsSuccess(success);
    setModalVisible(true);

    setTimeout(() => {
      setModalVisible(false);
      onClose();
    }, 2000);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showCustomAlert("Please enter email and password.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Logged in:", user.email);

      showCustomAlert("Login successful !!!", true, () =>
        router.replace("/Screens/RecipeGenerator01")
      );
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "Login failed. Please try again.";
      if (error.code === "auth/user-not-found") {
        errorMessage = "No user found with this email.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      }

      showCustomAlert(errorMessage);
    }
  };

  const navigateToSignUp = () => {
    router.push("/Login/register");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#262626" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#262626" }}>
              <Animatable.View animation="fadeInDown" duration={1200} style={styles.logoContainer}>
                <Animatable.Image
                  animation="bounceIn"
                  delay={500}
                  source={require("../../assets/images/chef 2.png")}
                  style={styles.logo}
                />
                <Animatable.Text
                  animation="slideInUp"
                  delay={800}
                  style={styles.logoText}
                >
                  My Recipes
                </Animatable.Text>
              </Animatable.View>

              <View style={styles.contentContainer}>
                <Animatable.Text
                  animation="fadeInLeft"
                  delay={1000}
                  style={styles.title}
                >
                  Welcome!!
                </Animatable.Text>
                <Animatable.Text
                  animation="fadeInRight"
                  delay={1200}
                  style={styles.subtitle}
                >
                  Sign in to continue
                </Animatable.Text>

                {/* Email */}
                <Animatable.View animation="fadeInUp" delay={1400} style={styles.inputContainer}>
                  <Text style={styles.label}>Email</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[styles.textInput, { flex: 1 }]}
                      placeholder="Enter Your Email"
                      placeholderTextColor="#9E9E9E"
                      value={email}
                      onChangeText={(text) => {
                        if (text.includes("@") && !text.includes("@gmail.com")) {
                          const [prefix] = text.split("@");
                          setEmail(`${prefix}@gmail.com`);
                        } else {
                          setEmail(text);
                        }
                      }}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                </Animatable.View>

                {/* Password */}
                <Animatable.View animation="fadeInUp" delay={1600} style={styles.inputContainer}>
                  <Text style={styles.label}>Password</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[styles.textInput, { flex: 1 }]}
                      placeholder="Enter Your Password"
                      placeholderTextColor="#9E9E9E"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!passwordVisible}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      onPress={() => setPasswordVisible(!passwordVisible)}
                      style={{ paddingHorizontal: 8 }}
                      activeOpacity={0.7}
                    >
                      <MaterialCommunityIcons
                        name={passwordVisible ? "eye-outline" : "eye-off-outline"}
                        size={24}
                        color="#8B4513"
                      />
                    </TouchableOpacity>
                  </View>
                </Animatable.View>

                {/* Button */}
                <Animatable.View animation="zoomIn" delay={1800} style={{ width: "90%" }}>
                  <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Sign in</Text>
                  </TouchableOpacity>
                </Animatable.View>

                <Animatable.Text
                  animation="fadeIn"
                  delay={2000}
                  style={styles.registerText}
                >
                  Don't have an account?{" "}
                  <Text style={styles.registerLink} onPress={navigateToSignUp}>
                    Register
                  </Text>
                </Animatable.Text>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* 🔔 Custom Alert Modal */}
      <Modal isVisible={modalVisible}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: isSuccess ? "#802b00" : "#FF4444" },
          ]}
        >
          <Text style={styles.modalText}>{modalMessage}</Text>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 50,
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
    textAlign: "center",
  },
  contentContainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 30,
  },
  title: {
    fontSize: 47,
    fontWeight: "bold",
    color: "#FFA500",
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
  inputWrapper: {
    borderWidth: 2,
    borderColor: "#8B4513",
    borderRadius: 10,
    backgroundColor: "#ffebcc",
    paddingHorizontal: 10,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    color: "#000",
    fontSize: 16,
    paddingVertical: 0,
  },
  button: {
    backgroundColor: "#8B4513",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
    height: 44,
    width: "100%",
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
  modalContainer: {
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Login;
