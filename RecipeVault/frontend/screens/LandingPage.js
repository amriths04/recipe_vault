import React from "react";
import { View, Text, StyleSheet, ScrollView, StatusBar } from "react-native";
import Sidebar from "../components/Sidebar"; // Sidebar
import SearchBar from "../components/SearchBar"; // Search Bar
import FeaturedCarousel from "../components/FeaturedCarousel"; // Featured Recipes
import { useTheme } from "../context/ThemeContext"; // Theme Context
import BookmarkedRecipesButton from "../components/BookmarkedRecipesButton"; // 📌 Button
import ShoppingListButton from "../components/ShoppingListButton"; // 🛒 Button
import OngoingOrdersButton from "../components/OngoingOrdersButton"; // 🚚 Button
import Header from "../components/Header";

const LandingPage = ({ navigation }) => {
  const { isDarkMode } = useTheme(); // Get theme state

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? "#1c1c1c" : "#fff" }]}>
      {/* ✅ Fix Status Bar */}
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* ✅ Keep Header Fixed at Top */}
      <Header />

      {/* Sidebar (Floating Above Everything) */}
      <Sidebar navigation={navigation} />

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* <SearchBar onSearch={handleSearch} /> */}

        <Text style={[styles.sectionTitle, { color: isDarkMode ? "#fff" : "#333" }]}>
          Featured Recipes
        </Text>
        <FeaturedCarousel />

        {/* Buttons */}
        <View style={styles.row}>
          <ShoppingListButton style={styles.halfButton} />
          <OngoingOrdersButton style={styles.halfButton} />
        </View>

        <BookmarkedRecipesButton />

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
    flex: 1, // ✅ Ensures full screen
    backgroundColor: "#fff", // ✅ White background for light mode
  },
  scrollContainer: {
    flexGrow: 1, // ✅ Allows scrolling
    paddingHorizontal: 20,
    paddingTop: 10, // ✅ Reduced top padding
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingHorizontal: 0, // Ensures equal spacing from left & right
  },
  halfButton: {
    flex: 1, // ✅ Each button takes half width
    marginHorizontal: 5, // Equal spacing between buttons
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5, // ✅ Reduced top margin
    marginBottom: 5,
    alignSelf: "center",
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10, // ✅ Reduced space before welcome text
    alignSelf: "center",
  },
});
