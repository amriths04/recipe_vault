import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Alert,
} from "react-native";
import { loginUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext"; // Import theme hook

export default function LoginScreen({ navigation }) {
  const { isDarkMode } = useTheme(); // Get dark mode state globally
  const { login } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const fadeAnim = new Animated.Value(1);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const toggleForm = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start(() => {
      setIsLogin(!isLogin);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
    });
  };

  const handleRegisterPress = () => {
    if (!formData.username || !formData.email || !formData.phone || !formData.password) {
      alert("Please fill all fields before proceeding.");
      return;
    }
    navigation.navigate("RegisterStep2", { formData });
  };

  const handleLoginPress = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    try {
      const response = await loginUser(formData.email, formData.password);
      if (response?.accessToken) {
        await AsyncStorage.setItem("userToken", response.accessToken);
        login(response.user, response.accessToken);
        Alert.alert("Success", "Login successful!");
        navigation.navigate("Landing");
      } else {
        Alert.alert("Login Failed", response.error || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.title, isDarkMode && styles.darkText]}>{isLogin ? "Login" : "Register"}</Text>

      <TextInput
        style={[styles.input, isDarkMode && styles.darkInput]}
        placeholder="Email"
        keyboardType="email-address"
        placeholderTextColor={isDarkMode ? "#bbb" : "#666"}
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
      />
      <TextInput
        style={[styles.input, isDarkMode && styles.darkInput]}
        placeholder="Password"
        secureTextEntry
        placeholderTextColor={isDarkMode ? "#bbb" : "#666"}
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
      />

      {!isLogin && (
        <Animated.View style={{ opacity: fadeAnim }}>
          <TextInput
            style={[styles.input, isDarkMode && styles.darkInput]}
            placeholder="Username"
            placeholderTextColor={isDarkMode ? "#bbb" : "#666"}
            value={formData.username}
            onChangeText={(text) => setFormData({ ...formData, username: text })}
          />
          <TextInput
            style={[styles.input, isDarkMode && styles.darkInput]}
            placeholder="Phone"
            keyboardType="phone-pad"
            placeholderTextColor={isDarkMode ? "#bbb" : "#666"}
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
          />
        </Animated.View>
      )}

      <TouchableOpacity style={[styles.button, isDarkMode && styles.darkButton]} onPress={isLogin ? handleLoginPress : handleRegisterPress}>
        <Text style={styles.buttonText}>{isLogin ? "Login" : "Next"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={toggleForm}>
        <Text style={[styles.toggleText, isDarkMode && styles.darkText]}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Text style={styles.toggleButton}>{isLogin ? "Register" : "Login"}</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Landing")}>
        <Text style={[styles.landingText, isDarkMode && styles.darkText]}>Skip to Landing Page →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" },
  darkContainer: { backgroundColor: "#121212" },

  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, color: "#000" },
  darkText: { color: "#fff" },

  input: {
    width: 300, height: 50, backgroundColor: "#fff", borderRadius: 8,
    paddingHorizontal: 15, marginBottom: 10, borderWidth: 1, borderColor: "#ccc",
    fontSize: 16, color: "#333",
  },
  darkInput: { backgroundColor: "#222", color: "#fff", borderColor: "#444" },

  button: { width: 300, height: 50, backgroundColor: "#007bff", justifyContent: "center", alignItems: "center", borderRadius: 8, marginTop: 10 },
  darkButton: { backgroundColor: "#1e88e5" },

  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  toggleText: { marginTop: 15, fontSize: 16, color: "#333" },
  toggleButton: { color: "#007bff", fontWeight: "bold" },
  landingText: { marginTop: 20, fontSize: 14, color: "#555" },
});

