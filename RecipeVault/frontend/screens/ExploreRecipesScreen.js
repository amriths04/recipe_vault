import React, { useEffect, useState } from "react";
import { 
  View, Text, FlatList, TouchableOpacity, StyleSheet, 
  ActivityIndicator, Image, StatusBar 
} from "react-native";
import { fetchRecipes } from "../services/recipeService";
import { useTheme } from "../context/ThemeContext"; // Dark Mode Support

const ExploreRecipesScreen = ({ navigation }) => {
  const { isDarkMode } = useTheme(); // Get theme state
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRecipes = async () => {
      setLoading(true);
      const data = await fetchRecipes();
      if (!data.error) {
        setRecipes(data);
      } else {
        console.error("Error fetching recipes:", data.error);
      }
      setLoading(false);
    };

    getRecipes();
  }, []);

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* ✅ Dynamic Status Bar */}
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={isDarkMode ? "#1c1c1c" : "#fff"} 
      />
      
      <Text style={[styles.heading, isDarkMode && styles.darkText]}>
        🍽️ Explore Delicious Recipes
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#3498db" />
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item._id}
          numColumns={2} // ✅ Grid layout
          showsVerticalScrollIndicator={false} // ✅ Hide scroll bar for clean UI
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.recipeCard, isDarkMode && styles.darkCard]}
              onPress={() => navigation.navigate("RecipeDetails", { recipeId: item._id })}
            >
              {/* ✅ Show Recipe Image */}
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.recipeImage} resizeMode="cover" />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={[styles.placeholderText, isDarkMode && styles.darkText]}>
                    No Image
                  </Text>
                </View>
              )}

              <Text style={[styles.recipeName, isDarkMode && styles.darkText]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  darkContainer: { backgroundColor: "#1c1c1c" },

  heading: { 
    fontSize: 24, fontWeight: "bold", marginBottom: 10, 
    textAlign: "center", color: "#2c3e50" 
  },
  darkText: { color: "#fff" },

  recipeCard: { 
    flex: 1, margin: 8, backgroundColor: "#f8f9fa", 
    borderRadius: 12, shadowColor: "#000", 
    shadowOffset: { width: 0, height: 3 }, 
    shadowOpacity: 0.2, shadowRadius: 5, 
    elevation: 5, alignItems: "center", padding: 10 
  },
  darkCard: { backgroundColor: "#2c3e50" },

  recipeImage: { width: 130, height: 100, borderRadius: 10 },

  imagePlaceholder: { 
    width: 130, height: 100, borderRadius: 10, 
    backgroundColor: "#d3d3d3", justifyContent: "center", alignItems: "center" 
  },

  placeholderText: { fontSize: 14, color: "#555" },

  recipeName: { fontSize: 16, fontWeight: "bold", marginTop: 10, textAlign: "center" },
});

export default ExploreRecipesScreen;
