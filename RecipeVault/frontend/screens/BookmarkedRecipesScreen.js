import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext"; // Import useTheme

export default function BookmarkedRecipesScreen() {
  const { isDarkMode } = useTheme(); // Get dark mode state globally

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.text, isDarkMode && styles.darkText]}>Bookmarked Recipes 📌</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8", // Light mode background
  },
  darkContainer: {
    backgroundColor: "#121212", // Dark mode background
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black", // Light mode text color
  },
  darkText: {
    color: "white", // Dark mode text color
  },
});
