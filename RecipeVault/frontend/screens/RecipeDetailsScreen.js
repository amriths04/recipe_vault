import React, { useEffect, useState } from "react";
import { 
  View, Text, StyleSheet, ActivityIndicator, ScrollView, 
  Image, StatusBar 
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { fetchRecipeById } from "../services/recipeService";
import { useTheme } from "../context/ThemeContext"; // Dark Mode Support

const RecipeDetailsScreen = () => {
  const route = useRoute();
  const { recipeId } = route.params;
  const { isDarkMode } = useTheme(); // Get theme state

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRecipeDetails = async () => {
      setLoading(true);
      const data = await fetchRecipeById(recipeId);
      if (!data.error) {
        setRecipe(data);
      } else {
        console.error("Error fetching recipe details:", data.error);
      }
      setLoading(false);
    };

    getRecipeDetails();
  }, [recipeId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.errorContainer}>
        <Text style={[styles.errorText, isDarkMode && styles.darkText]}>
          Error loading recipe details.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* ✅ Dynamic Status Bar */}
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={isDarkMode ? "#1c1c1c" : "#fff"} 
      />

      {/* Recipe Image */}
      {recipe.image && (
        <Image source={{ uri: recipe.image }} style={styles.recipeImage} resizeMode="cover" />
      )}

      {/* Recipe Title */}
      <Text style={[styles.heading, isDarkMode && styles.darkText]}>{recipe.name}</Text>

      {/* Recipe Description */}
      <Text style={[styles.description, isDarkMode && styles.darkText]}>
        {recipe.description}
      </Text>

      {/* Ingredients Section */}
      <Text style={[styles.subHeading, isDarkMode && styles.darkSubHeading]}>🛒 Ingredients</Text>
      <View style={[styles.card, isDarkMode && styles.darkCard]}>
        {recipe.ingredients.map((ingredient, index) => (
          <Text key={index} style={[styles.listItem, isDarkMode && styles.darkText]}>
            🔹 {ingredient.name} - {ingredient.quantity}
          </Text>
        ))}
      </View>

      {/* Procedure Section */}
      <Text style={[styles.subHeading, isDarkMode && styles.darkSubHeading]}>📖 Procedure</Text>
      <View style={[styles.card, isDarkMode && styles.darkCard]}>
        {recipe.procedure.map((step, index) => (
          <Text key={index} style={[styles.listItem, isDarkMode && styles.darkText]}>
            {index + 1}. {step}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 18, color: "red" },

  container: { padding: 20, backgroundColor: "#fff", paddingTop: StatusBar.currentHeight + 10 },
  darkContainer: { backgroundColor: "#1c1c1c" },

  recipeImage: { width: "100%", height: 250, borderRadius: 15, marginBottom: 15 },

  heading: { fontSize: 26, fontWeight: "bold", color: "#2c3e50", marginBottom: 10, textAlign: "center" },
  darkText: { color: "#fff" },

  description: { fontSize: 16, marginBottom: 10, color: "#555", textAlign: "center", fontStyle: "italic" },

  subHeading: { fontSize: 22, fontWeight: "bold", color: "#3498db", marginTop: 20, marginBottom: 10 },
  darkSubHeading: { color: "#85c1e9" },

  card: { backgroundColor: "#f0f8ff", padding: 15, borderRadius: 10, elevation: 3, marginBottom: 10 },
  darkCard: { backgroundColor: "#2c3e50" },

  listItem: { fontSize: 16, marginBottom: 5, color: "#2c3e50" },
});

export default RecipeDetailsScreen;
