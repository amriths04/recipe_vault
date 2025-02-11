import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Sidebar from "../components/Sidebar"; // Sidebar
import SearchBar from "../components/SearchBar"; // Search Bar
import FeaturedCarousel from "../components/FeaturedCarousel"; // Featured Recipes
import { useTheme } from "../context/ThemeContext"; // Theme Context
import BookmarkedRecipesButton from "../components/BookmarkedRecipesButton"; // 📌 Button
import ShoppingListButton from "../components/ShoppingListButton"; // 🛒 Button
import OngoingOrdersButton from "../components/OngoingOrdersButton"; // 🚚 Button

const LandingPage = ({ navigation }) => {
  const { isDarkMode } = useTheme(); // Get theme state

  const handleSearch = (query) => {
    console.log("Searching for:", query);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? "#1c1c1c" : "#f8f9fa" }]}>
      <Sidebar navigation={navigation} />

      {/* Wrap content in ScrollView to enable scrolling */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />

        {/* Featured Recipes Section */}
        <Text style={[styles.sectionTitle, { color: isDarkMode ? "#fff" : "#333" }]}>
          Featured Recipes
        </Text>
        <FeaturedCarousel />

        {/* 🛒 🚚 Buttons in Row */}
        <View style={styles.row}>
  <ShoppingListButton style={styles.halfButton} />
  <OngoingOrdersButton style={styles.halfButton} />
</View>


        {/* Multiple BookmarkedRecipesButtons for testing scrolling */}
        <BookmarkedRecipesButton />


        {/* Welcome Message */}
        <Text style={[styles.welcomeText, { color: isDarkMode ? "#fff" : "#333" }]}>
          Welcome to Recipe Vault! 🚀
        </Text>
      </ScrollView>
    </View>
  );
};

export default LandingPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  scrollContainer: {
    flexGrow: 1, // Allows scrolling when content overflows
    padding: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingHorizontal: 0, // Ensures equal spacing from left & right
  },
  halfButton: {
    flex: 1, // Each button takes half width
    marginHorizontal: 5, // Equal spacing between buttons
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
