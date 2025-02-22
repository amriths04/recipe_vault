import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext"; // Import theme hook

export default function HomeScreen({ navigation }) {
  const { isDarkMode } = useTheme(); // Get dark mode state

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Login"); // Navigate after 3 seconds
    }, 3000);
    return () => clearTimeout(timer); // Cleanup on unmount
  }, [navigation]);

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Recipe Book Effect */}
      <View style={[styles.bookContainer, isDarkMode && styles.darkBookContainer]}>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>📖 Recipe Vault</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2c3e50", // Dark background like the sidebar
  },
  darkContainer: { backgroundColor: "#121212" }, // Dark mode background

  bookContainer: {
    width: 280,
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: "#f8f1e1", // Light parchment-like color
    borderRadius: 10,
    elevation: 5, // Shadow effect
    borderWidth: 2,
    borderColor: "#d2a679", // Light brown like an old book
    alignItems: "center",
  },
  darkBookContainer: {
    backgroundColor: "#333", // Dark book effect
    borderColor: "#777", // Darker book outline
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#3d2b1f", // Dark brown for classic feel
    textAlign: "center",
  },
  darkText: { color: "#f5f5f5" }, // Light text for dark mode
});
