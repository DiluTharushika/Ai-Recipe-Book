import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, ScrollView,
  TextInput, Alert
} from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { auth, db } from "../../config/firebaseConfig";
import { signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { uploadImageToCloudinary } from "../../config/cloudinary"; // Make sure this file exists

export default function Profile() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        setUsername(userData.username || "User");
        setEmail(userData.email || user.email);
        setProfileImage(userData.profileImage || null);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log("Error fetching user data:", error);
    }
  };

  const handleChangePicture = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;

      try {
        const cloudinaryUrl = await uploadImageToCloudinary(imageUri);

        // Save to Firestore
        await updateDoc(doc(db, "users", user.uid), {
          profileImage: cloudinaryUrl,
        });

        setProfileImage(cloudinaryUrl);
        Alert.alert("Success", "Profile image updated!");
      } catch (error) {
        console.error("Upload failed:", error);
        Alert.alert("Error", "Failed to upload image.");
      }
    }
  };

  const handleSaveUsername = async () => {
    try {
      await updateDoc(doc(db, "users", user.uid), {
        username: username,
      });
      setIsEditing(false);
      Alert.alert("Saved", "Username updated successfully.");
    } catch (error) {
      console.log("Error updating username:", error);
      Alert.alert("Error", "Failed to update username.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      console.log("Error logging out:", error);
      Alert.alert("Error", "Failed to logout.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>My Profile</Text>

      <View style={styles.profileTop}>
        <Image
          source={
            profileImage
              ? { uri: profileImage }
              : require('../../assets/images/banner 02.jpeg')
          }
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.cameraIcon} onPress={handleChangePicture}>
          <Ionicons name="camera" size={18} color="#1E1E1E" />
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <View style={styles.infoRow}>
          <Ionicons name="person" size={20} color="#D2B48C" />
          <View style={styles.infoTextBox}>
            <Text style={styles.label}>User Name</Text>
            {isEditing ? (
              <>
                <TextInput
                  style={styles.input}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Enter username"
                  placeholderTextColor="#999"
                />
                <TouchableOpacity onPress={handleSaveUsername}>
                  <Text style={styles.saveBtn}>Save</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity onPress={() => setIsEditing(true)}>
                <Text style={styles.infoText}>{username} <Feather name="edit" size={16} color="#D2B48C" /></Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons name="email" size={20} color="#D2B48C" />
          <View style={styles.infoTextBox}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.infoText}>{email}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.myRecipesBox} onPress={() => router.push("/(tabs)/add")}>
        <Text style={styles.sectionTitle}>My Recipes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Feather name="log-out" size={18} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    padding: 20,
  },
  headerTitle: {
    fontSize: 26,
    color: '#D2B48C',
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  profileTop: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 110,
    backgroundColor: '#D2B48C',
    borderRadius: 15,
    padding: 4,
  },
  infoBox: {
    borderColor: '#D2B48C',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#2A2A2A',
    marginBottom: 30,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  infoTextBox: {
    marginLeft: 10,
    flex: 1,
  },
  label: {
    color: '#aaa',
    fontSize: 12,
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 2,
  },
  input: {
    color: '#fff',
    fontSize: 16,
    borderBottomColor: '#D2B48C',
    borderBottomWidth: 1,
    paddingVertical: 2,
    marginTop: 4,
  },
  saveBtn: {
    color: '#D2B48C',
    marginTop: 6,
  },
  myRecipesBox: {
    backgroundColor: '#2A2A2A',
    padding: 15,
    borderRadius: 10,
    borderColor: '#D2B48C',
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 40,
  },
  sectionTitle: {
    color: '#D2B48C',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#8B4513',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
});
