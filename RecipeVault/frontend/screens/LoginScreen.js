import React, { useState, useContext, useEffect } from "react";
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
import { useTheme } from "../context/ThemeContext";

export default function LoginScreen({ navigation }) {
  const { isDarkMode } = useTheme();
  const { login } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const fadeAnim = new Animated.Value(1);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState("");
  const [allFieldsValid, setAllFieldsValid] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const checkPasswordStrength = (password) => {
    if (password.length < 6) return "Weak";
    if (/(?=.*[A-Z])(?=.*\d)/.test(password)) return "Strong";
    return "Medium";
  };

  useEffect(() => {
    const { username, email, phone } = formData;
    const usernameValid = username && username.length >= 3;
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const phoneValid = /^\d{10}$/.test(phone);
    setAllFieldsValid(usernameValid && emailValid && phoneValid);
  }, [formData.username, formData.email, formData.phone]);

  const toggleForm = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start(() => {
      setIsLogin(!isLogin);
      setErrors({});
      setPasswordStrength("");
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
    });
  };

  const handleRegisterPress = () => {
    const { username, email, phone, password } = formData;
    const newErrors = {};

    if (!username) newErrors.username = "Username is required";
    else if (username.length < 3) newErrors.username = "Min 3 characters";

    if (!email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Invalid email format";

    if (!phone) newErrors.phone = "Phone is required";
    else if (!/^\d{10}$/.test(phone))
      newErrors.phone = "Phone must be 10 digits";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const strength = checkPasswordStrength(password);
      setPasswordStrength(strength);

      if (strength === "Weak") {
        setErrors({ password: "Password strength is too weak" });
        return;
      }

      navigation.navigate("RegisterStep2", { formData });
    } else {
      setPasswordStrength(""); // Hide password strength if other validations fail
    }
  };

  const handleLoginPress = async () => {
    const { email, password } = formData;
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);

    if (Object.keys(newErrors).length !== 0) return;

    try {
      const response = await loginUser(email, password);
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
      <Text style={[styles.title, isDarkMode && styles.darkText]}>
        {isLogin ? "Login" : "Register"}
      </Text>

      <TextInput
        style={[
          styles.input,
          isDarkMode && styles.darkInput,
          errors.email && { borderColor: "red" },
        ]}
        placeholder={isLogin ? "Email or Username" : "Email"}
        keyboardType="email-address"
        placeholderTextColor={isDarkMode ? "#bbb" : "#666"}
        value={formData.email}
        onChangeText={(text) => {
          setFormData({ ...formData, email: text });
          setErrors({ ...errors, email: null });
        }}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <TextInput
        style={[
          styles.input,
          isDarkMode && styles.darkInput,
          errors.password && { borderColor: "red" },
        ]}
        placeholder="Password"
        secureTextEntry
        placeholderTextColor={isDarkMode ? "#bbb" : "#666"}
        value={formData.password}
        onChangeText={(text) => {
          setFormData({ ...formData, password: text });
          setErrors({ ...errors, password: null });

          if (!isLogin && allFieldsValid) {
            const strength = checkPasswordStrength(text);
            setPasswordStrength(strength);
          } else {
            setPasswordStrength("");
          }
        }}
      />
      {errors.password && (
        <Text style={styles.errorText}>{errors.password}</Text>
      )}

      {!isLogin && (
        <Animated.View style={{ opacity: fadeAnim }}>
          <TextInput
            style={[
              styles.input,
              isDarkMode && styles.darkInput,
              errors.username && { borderColor: "red" },
            ]}
            placeholder="Username"
            placeholderTextColor={isDarkMode ? "#bbb" : "#666"}
            value={formData.username}
            onChangeText={(text) => {
              setFormData({ ...formData, username: text });
              setErrors({ ...errors, username: null });
            }}
          />
          {errors.username && (
            <Text style={styles.errorText}>{errors.username}</Text>
          )}

          <TextInput
            style={[
              styles.input,
              isDarkMode && styles.darkInput,
              errors.phone && { borderColor: "red" },
            ]}
            placeholder="Phone"
            keyboardType="phone-pad"
            placeholderTextColor={isDarkMode ? "#bbb" : "#666"}
            value={formData.phone}
            onChangeText={(text) => {
              setFormData({ ...formData, phone: text });
              setErrors({ ...errors, phone: null });
            }}
          />
          {errors.phone && (
            <Text style={styles.errorText}>{errors.phone}</Text>
          )}
        </Animated.View>
      )}

      {!isLogin && passwordStrength ? (
        <Text
          style={[
            styles.strengthText,
            {
              color:
                passwordStrength === "Weak"
                  ? "red"
                  : passwordStrength === "Medium"
                  ? "orange"
                  : "green",
            },
          ]}
        >
          Password Strength: {passwordStrength}
        </Text>
      ) : null}

      <TouchableOpacity
        style={[styles.button, isDarkMode && styles.darkButton]}
        onPress={isLogin ? handleLoginPress : handleRegisterPress}
      >
        <Text style={styles.buttonText}>{isLogin ? "Login" : "Next"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={toggleForm}>
        <Text style={[styles.toggleText, isDarkMode && styles.darkText]}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Text style={styles.toggleButton}>
            {isLogin ? "Register" : "Login"}
          </Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Landing")}>
        <Text style={[styles.landingText, isDarkMode && styles.darkText]}>
          Skip to Landing Page →
        </Text>
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
  darkContainer: {
    backgroundColor: "#121212",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  darkText: {
    color: "#fff",
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
  darkInput: {
    backgroundColor: "#222",
    color: "#fff",
    borderColor: "#444",
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
  darkButton: {
    backgroundColor: "#1e88e5",
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
  errorText: {
    color: "red",
    fontSize: 13,
    marginBottom: 5,
    alignSelf: "flex-start",
    marginLeft: 40,
  },
  strengthText: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    alignSelf: "flex-start",
    marginLeft: 40,
  },
});
