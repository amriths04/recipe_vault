import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, Alert, StatusBar 
} from "react-native";
import { registerUser } from "../services/authService";
import { useTheme } from "../context/ThemeContext"; // Dark Mode Support

const RegisterStep2 = ({ route, navigation }) => {  // ⬅️ Removed extra export default
  const { formData } = route.params; // Step 1 data
  const { isDarkMode } = useTheme(); // Get theme state

  const [profileData, setProfileData] = useState({
    name: "",
    dob: "",
  });

  const handleSubmit = async () => {
    const finalData = { ...formData, ...profileData };

    if (!finalData.name.trim() || !finalData.dob.trim()) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      const response = await registerUser(
        finalData.username,
        finalData.email,
        finalData.phone,
        finalData.password,
        finalData.name,
        finalData.dob
      );

      if (response?.accessToken) {
        Alert.alert("Success", "Registration successful!");
        navigation.navigate("Login");
      } else {
        Alert.alert("Registration Failed", response.error || "Something went wrong.");
      }
    } catch (error) {
      console.error("Register error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={isDarkMode ? "#1c1c1c" : "#fff"} />
      <Text style={[styles.title, isDarkMode && styles.darkText]}>✨ Complete Your Profile</Text>

      <TextInput
        style={[styles.input, isDarkMode && styles.darkInput]}
        placeholder="Full Name"
        placeholderTextColor={isDarkMode ? "#bbb" : "#666"}
        value={profileData.name}
        onChangeText={(text) => setProfileData({ ...profileData, name: text })}
      />

      <TextInput
        style={[styles.input, isDarkMode && styles.darkInput]}
        placeholder="Date of Birth (YYYY-MM-DD)"
        placeholderTextColor={isDarkMode ? "#bbb" : "#666"}
        value={profileData.dob}
        onChangeText={(text) => setProfileData({ ...profileData, dob: text })}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.backButton]} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>⬅️ Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>✅ Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ✅ Only ONE export default at the end
export default RegisterStep2;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5", padding: 20 },
  darkContainer: { backgroundColor: "#1c1c1c" },

  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#333" },
  darkText: { color: "#fff" },

  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  darkInput: {
    backgroundColor: "#333",
    borderColor: "#555",
    color: "#fff",
  },

  buttonContainer: { flexDirection: "row", marginTop: 10 },
  button: {
    width: 140,
    height: 50,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 5,
  },
  backButton: { backgroundColor: "#6c757d" },

  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
