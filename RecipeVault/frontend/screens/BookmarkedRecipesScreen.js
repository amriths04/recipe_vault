import React, { useEffect, useState, useContext, useCallback } from "react"; 
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Image, Button } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native"; 
import { useTheme } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext"; 
import { fetchBookmarkedRecipes } from "../services/recipeService";
import { removeBookmarks, sendToShoppingList } from "../services/bookmarkService"; // ✅ Import both

export default function BookmarkedRecipesScreen() {
  const { isDarkMode } = useTheme();
  const { token, user } = useContext(AuthContext); // ✅ Get user also
  const navigation = useNavigation();

  const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipes, setSelectedRecipes] = useState([]); // ✅ Track selected recipes

  // 🔹 Load bookmarked recipes
  const loadBookmarkedRecipes = async () => {
    if (!token) return;
    setLoading(true);
    const recipes = await fetchBookmarkedRecipes(token);
    setBookmarkedRecipes(recipes);
    setLoading(false);
  };

  // 🔹 Select/Deselect a recipe
  const toggleSelection = (recipeId) => {
    setSelectedRecipes((prevSelected) =>
      prevSelected.includes(recipeId)
        ? prevSelected.filter((id) => id !== recipeId)
        : [...prevSelected, recipeId]
    );
  };

  // 🔹 Remove selected recipes from bookmarks
  const handleRemoveBookmarks = async () => {
    if (selectedRecipes.length > 0) {
      const result = await removeBookmarks(selectedRecipes, token);
      if (!result.error) {
        setBookmarkedRecipes((prev) => prev.filter((recipe) => !selectedRecipes.includes(recipe._id)));
        setSelectedRecipes([]);
      }
    }
  };

  // 🔹 Send selected recipes to shopping list
  const handleSendToShoppingList = async () => {
    if (selectedRecipes.length > 0 && user?._id) {
      const result = await sendToShoppingList(selectedRecipes, user._id); // ✅ Use user._id instead of token
      if (!result.error) {
        alert("✅ Sent to shopping list successfully!");
        setSelectedRecipes([]); // Reset selection
      } else {
        alert("❌ Failed to send to shopping list.");
      }
    }
  };

  // 🔹 Refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadBookmarkedRecipes();
    }, [token])
  );

  if (loading) {
    return (
      <View style={[styles.container, isDarkMode && styles.darkContainer]}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.heading, isDarkMode && styles.darkText]}>📌 Bookmarked Recipes</Text>

      {/* Selection Actions */}
      {selectedRecipes.length > 0 && (
        <View style={styles.selectedTextContainer}>
          <Text style={styles.selectedText}>
            {selectedRecipes.length} {selectedRecipes.length === 1 ? "recipe" : "recipes"} selected
          </Text>
          <Button title="Remove Selected" onPress={handleRemoveBookmarks} color="#e74c3c" />
          <Button title="Send to Shopping List" onPress={handleSendToShoppingList} color="#2ecc71" />
        </View>
      )}

      {bookmarkedRecipes.length === 0 ? (
        <Text style={[styles.noRecipesText, isDarkMode && styles.darkText]}>No bookmarks yet.</Text>
      ) : (
        <FlatList
          data={bookmarkedRecipes}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.recipeCard, isDarkMode && styles.darkCard]}
              onPress={() => navigation.navigate("RecipeDetails", { recipeId: item._id })}
            >
              <Image source={{ uri: item.image || "https://via.placeholder.com/150" }} style={styles.recipeImage} />
              <View style={styles.textContainer}>
                <Text style={[styles.recipeName, isDarkMode && styles.darkText]}>{item.name}</Text>
                <Text style={[styles.recipeDesc, isDarkMode && styles.darkText]} numberOfLines={2}>
                  {item.description}
                </Text>
              </View>
              {/* Select Circle */}
              <TouchableOpacity onPress={() => toggleSelection(item._id)} style={[styles.selectCircle, selectedRecipes.includes(item._id) && styles.selectedCircle]}>
                {selectedRecipes.includes(item._id) && <Text style={styles.selectCircleText}>✓</Text>}
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f8f8" },
  darkContainer: { backgroundColor: "#121212" },

  heading: { fontSize: 22, fontWeight: "bold", marginBottom: 15, textAlign: "center", color: "black" },
  darkText: { color: "white" },

  noRecipesText: { fontSize: 16, textAlign: "center", marginTop: 20, color: "gray" },

  recipeCard: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  darkCard: { backgroundColor: "#1e1e1e" },

  recipeImage: { width: 60, height: 60, borderRadius: 10, marginRight: 15 },
  textContainer: { flex: 1 },

  recipeName: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  recipeDesc: { fontSize: 14, color: "#555" },

  selectedTextContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  selectedText: { fontSize: 16, fontWeight: "bold" },

  // Circle Style
  selectCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  selectedCircle: {
    backgroundColor: "#3498db", // Filled when selected
  },
  selectCircleText: {
    color: "#fff",
    fontSize: 18,
  },
});
