import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";

export default function LoginScreen({ navigation }) {
  const [isLogin, setIsLogin] = useState(true);
  const fadeAnim = new Animated.Value(1);

  // Form Data (Step 1 for Register)
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? "Login" : "Register"}</Text>

            {/* Always show login fields */}
            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                placeholderTextColor="#666"
        value={formData.email}  // ✅ Ensure value is set
        onChangeText={(text) => setFormData({ ...formData, email: text })}  // ✅ Update state
      />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                placeholderTextColor="#666"
        value={formData.password}  // ✅ Ensure value is set
        onChangeText={(text) => setFormData({ ...formData, password: text })}  // ✅ Update state
      />

            {/* Registration fields only in Register mode */}
            {!isLogin && (
                <Animated.View style={{ opacity: fadeAnim }}>
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        placeholderTextColor="#666"
                        value={formData.username}  // ✅ Ensure value is set
                        onChangeText={(text) => setFormData({ ...formData, username: text })}  // ✅ Update state
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Phone"
                        keyboardType="phone-pad"
                        placeholderTextColor="#666"
                        value={formData.phone}  // ✅ Ensure value is set
                        onChangeText={(text) => setFormData({ ...formData, phone: text })}  // ✅ Update state
          />
                </Animated.View>
            )}

      {/* Login/Register Button */}
      {isLogin ? (
        <TouchableOpacity style={styles.button}>
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

