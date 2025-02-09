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

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const fadeAnim = new Animated.Value(1);

  // Form Data (Step 1 for Register & Login)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  // Toggle between Login & Register with smooth fade
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

  // Handle "Register" Press → Navigate to Step 2
  const handleRegisterPress = () => {
    if (!formData.username || !formData.email || !formData.phone || !formData.password) {
      alert("Please fill all fields before proceeding.");
      return;
    }
    navigation.navigate("RegisterStep2", { formData });
  };

  // Handle "Login" Press
  const handleLoginPress = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    try {
      const response = await loginUser(formData.email, formData.password);
  
      if (response?.accessToken) {
        await AsyncStorage.setItem("userToken", response.accessToken); // ✅ Store token
        console.log("✅ Token saved:", response.accessToken);
        login(response.user, response.accessToken); // Save login state globally
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
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? "Login" : "Register"}</Text>

      {/* Always show login fields */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        placeholderTextColor="#666"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        placeholderTextColor="#666"
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
      />

      {/* Registration fields only in Register mode */}
      {!isLogin && (
        <Animated.View style={{ opacity: fadeAnim }}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#666"
            value={formData.username}
            onChangeText={(text) => setFormData({ ...formData, username: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone"
            keyboardType="phone-pad"
            placeholderTextColor="#666"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
          />
        </Animated.View>
      )}

      {/* Login/Register Button */}
      {isLogin ? (
        <TouchableOpacity style={styles.button} onPress={handleLoginPress}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleRegisterPress}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      )}

      {/* Toggle Between Login & Register */}
      <TouchableOpacity onPress={toggleForm}>
        <Text style={styles.toggleText}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Text style={styles.toggleButton}>{isLogin ? "Register" : "Login"}</Text>
        </Text>
      </TouchableOpacity>

      {/* Go to Landing Page */}
      <TouchableOpacity onPress={() => navigation.navigate("Landing")}>
        <Text style={styles.landingText}>Skip to Landing Page →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: 300,
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 16,
    color: "#333",
  },
  button: {
    width: 300,
    height: 50,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  toggleText: {
    marginTop: 15,
    fontSize: 16,
    color: "#333",
  },
  toggleButton: {
    color: "#007bff",
    fontWeight: "bold",
  },
  landingText: {
    marginTop: 20,
    fontSize: 14,
    color: "#555",
  },
});
