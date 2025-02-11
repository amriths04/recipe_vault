import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Sidebar from "../components/Sidebar"; // Import Sidebar
import { useTheme } from "../context/ThemeContext"; // Import Theme Context

const LandingPage = ({ navigation }) => {
  const { isDarkMode } = useTheme(); // Get theme state

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? "#1c1c1c" : "#f8f9fa" }]}>
      <Sidebar navigation={navigation} />
      <View style={styles.content}>
        <Text style={[styles.welcomeText, { color: isDarkMode ? "#fff" : "#333" }]}>
          Welcome to Recipe Vault! 🚀
        </Text>
      </View>
    </View>
  );
};

export default LandingPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
  },
});
