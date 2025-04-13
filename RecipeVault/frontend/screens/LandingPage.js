import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity } from "react-native";
import Sidebar from "../components/Sidebar"; // Sidebar
import FeaturedCarousel from "../components/FeaturedCarousel"; // Featured Recipes
import { useTheme } from "../context/ThemeContext"; // Theme Context
import BookmarkedRecipesButton from "../components/BookmarkedRecipesButton"; // 📌 Button
import ShoppingListButton from "../components/ShoppingListButton"; // 🛒 Button
import OngoingOrdersButton from "../components/OngoingOrdersButton"; // 🚚 Button
import Header from "../components/Header";
import { searchRecipes } from "../services/recipeService"; // Import your searchRecipes function

const LandingPage = ({ navigation }) => {
  const { isDarkMode } = useTheme(); // Get theme state
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState([]); // Add state for filtered recipes

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchQuery("");
      setFilteredRecipes([]);
      return;
    }

    setSearchQuery(query);
    try {
      const result = await searchRecipes(query);
      console.log("Search Response:", result);
      setFilteredRecipes(result);
      if (result.length === 0) {
        Alert.alert("No Recipes Found", `No results found for "${query}".`);
      }
    } catch (error) {
      setFilteredRecipes([]);
    }
  };


  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? "#1c1c1c" : "#fff"}
      />

      {/* ✅ Fixed Header at the Top */}
      <Header onSearch={handleSearch} />

      {/* Sidebar (Floating) */}
      <Sidebar navigation={navigation} />

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Display Search Results if any */}
        {searchQuery.trim() !== "" && (
          <>
            
            {filteredRecipes.length > 0 ? (
              filteredRecipes.map((recipe) => (
                <TouchableOpacity
  key={recipe._id}
  style={[styles.resultBox, isDarkMode && styles.resultBoxDark]}
  onPress={() =>
    navigation.navigate("RecipeDetails", { recipeId: recipe._id })
  }
>
  <Text style={[styles.resultText, isDarkMode && styles.darkText]}>
    {recipe.name}
  </Text>
</TouchableOpacity>

              ))
            ) : (
              <Text style={[styles.noResults, isDarkMode && styles.darkText]}>
                No recipes found.
              </Text>
            )}
          </>
        )}

        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
          Featured Recipes
        </Text>
        <FeaturedCarousel />
        {/* Buttons */}
        <View style={styles.row}>
          <ShoppingListButton style={styles.halfButton} />
          <OngoingOrdersButton style={styles.halfButton} />
        </View>

        <BookmarkedRecipesButton />

        <Text style={[styles.welcomeText, isDarkMode && styles.darkText]}>
          Welcome to Recipe Vault! 🚀
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures full screen
    backgroundColor: "#fff", // Default Light Mode
  },
  darkContainer: {
    backgroundColor: "#1c1c1c", // Dark Mode Background
  },
  scrollContainer: {
    flexGrow: 1, // Allows scrolling
    paddingHorizontal: 20,
    paddingTop: 0, // Reduced top padding
    justifyContent: "flex-start", // Ensure content is aligned from the top
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingHorizontal: 0, // Equal spacing from left & right
  },
  halfButton: {
    flex: 1, // Each button takes half width
    marginHorizontal: 5, // Equal spacing between buttons
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5, // Reduced top margin
    marginBottom: 5,
    alignSelf: "center",
    color: "#333", // Default Text Color
  },
  darkText: {
    color: "#fff", // White Text for Dark Mode
  },
  recipeName: {
    fontSize: 16,
    marginVertical: 5,
    color: "#333",
  },
  noResults: {
    fontSize: 16,
    color: "#888",
    alignSelf: "center", // Center the "No recipes found" text
    marginTop: 10, // Give it a little margin to separate it from the search bar
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10, // Reduced space before welcome text
    alignSelf: "center",
  },
  sidebar: {
    position: "absolute",
    right: 20,
    bottom: 30, // Increase this if it's being cut off
    backgroundColor: "#3b82f6",
    padding: 10,
    borderRadius: 10,
    // Add elevation or shadow if needed
  },
  resultBox: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 10,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
  },
  
  resultBoxDark: {
    backgroundColor: "#2c2c2e", // Dark mode box color
  },
  
  resultText: {
    fontSize: 16,
    color: "#333",
  },
  
});

export default LandingPage;
