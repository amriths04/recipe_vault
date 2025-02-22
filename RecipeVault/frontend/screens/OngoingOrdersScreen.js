import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext"; // Import useTheme

export default function OngoingOrdersScreen() {
  const { isDarkMode } = useTheme(); // Get dark mode state globally

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.title, isDarkMode && styles.darkText]}>Ongoing Orders 🚚</Text>
      <Text style={[styles.subtitle, isDarkMode && styles.darkText]}>
        Your orders are on the way!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "black",
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
  },
  darkText: {
    color: "white",
  },
});
