import React, { useEffect, useState, useContext, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Image } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native"; // ✅ Import useFocusEffect
import { useTheme } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext"; 
import { fetchBookmarkedRecipes } from "../services/recipeService";

export default function BookmarkedRecipesScreen() {
  const { isDarkMode } = useTheme();
  const { token } = useContext(AuthContext);
  const navigation = useNavigation(); 

  const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Function to load bookmarked recipes
  const loadBookmarkedRecipes = async () => {
    if (!token) return;
    setLoading(true);
    const recipes = await fetchBookmarkedRecipes(token);
    setBookmarkedRecipes(recipes);
    setLoading(false);
  };

  // 🔹 Refresh screen when it comes back into focus
  useFocusEffect(
    useCallback(() => {
      loadBookmarkedRecipes(); // ✅ Reload recipes when screen is focused
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
});
