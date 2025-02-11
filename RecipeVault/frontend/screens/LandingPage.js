import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Sidebar from "../components/Sidebar"; // Sidebar
import SearchBar from "../components/SearchBar"; // SearchBar
import FeaturedCarousel from "../components/FeaturedCarousel"; // Fixed Import
import { useTheme } from "../context/ThemeContext"; // Theme Context

const LandingPage = ({ navigation }) => {
  const { isDarkMode } = useTheme(); // Get theme state

  const handleSearch = (query) => {
    console.log("Searching for:", query);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? "#1c1c1c" : "#f8f9fa" }]}>
      <Sidebar navigation={navigation} />
      
      <View style={styles.content}>
        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />

        {/* Featured Recipes Section */}
        <Text style={[styles.sectionTitle, { color: isDarkMode ? "#fff" : "#333" }]}>
          Featured Recipes
        </Text>
        <FeaturedCarousel />

        {/* Welcome Message */}
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
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    alignSelf: "center",
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    alignSelf: "center",
  },
});
