import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext"; // ✅ Import AuthContext
import { fetchBookmarkedRecipes } from "../services/recipeService";

export default function BookmarkedRecipesScreen() {
  const { isDarkMode } = useTheme();
  const { token } = useContext(AuthContext); // ✅ Get token from context

  const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookmarkedRecipes = async () => {
      if (!token) return; // ✅ Ensure token exists
      setLoading(true);
      const recipes = await fetchBookmarkedRecipes(token);
      setBookmarkedRecipes(recipes);
      setLoading(false);
    };

    loadBookmarkedRecipes();
  }, [token]); // ✅ Re-run if token changes

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

      {bookmarkedRecipes.length === 0 ? (
        <Text style={[styles.noRecipesText, isDarkMode && styles.darkText]}>No bookmarks yet.</Text>
      ) : (
        <FlatList
          data={bookmarkedRecipes}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={[styles.recipeCard, isDarkMode && styles.darkCard]}>
              <Text style={[styles.recipeName, isDarkMode && styles.darkText]}>{item.name}</Text>
              <Text style={[styles.recipeDesc, isDarkMode && styles.darkText]} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f8f8" },
  darkContainer: { backgroundColor: "#121212" },

  heading: { fontSize: 22, fontWeight: "bold", marginBottom: 15, color: "black" },
  darkText: { color: "white" },

  noRecipesText: { fontSize: 16, textAlign: "center", marginTop: 20, color: "gray" },

  recipeCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  darkCard: { backgroundColor: "#1e1e1e" },

  recipeName: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  recipeDesc: { fontSize: 14, color: "#555" },
});
