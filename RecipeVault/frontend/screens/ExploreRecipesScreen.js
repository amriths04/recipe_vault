import React, { useEffect, useState } from "react";
import { 
  View, Text, FlatList, TouchableOpacity, StyleSheet, 
  ActivityIndicator, Image, StatusBar 
} from "react-native";
import { fetchRecipes } from "../services/recipeService";

const ExploreRecipesScreen = ({ navigation }) => {
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
    <View style={styles.container}>
      {/* ✅ FIX: Ensures white status bar */}
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <Text style={styles.heading}>🍽️ Explore Delicious Recipes</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#3498db" />
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item._id}
          numColumns={2} // ✅ Grid layout
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.recipeCard}
              onPress={() => navigation.navigate("RecipeDetails", { recipeId: item._id })}
            >
              {/* ✅ Show Recipe Image */}
              <Image source={{ uri: item.image }} style={styles.recipeImage} resizeMode="cover" />
              <Text style={styles.recipeName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },

  heading: { 
    fontSize: 24, fontWeight: "bold", marginBottom: 10, 
    textAlign: "center", color: "#2c3e50" 
  },

  recipeCard: { 
    flex: 1, margin: 8, backgroundColor: "#f8f9fa", 
    borderRadius: 12, shadowColor: "#000", 
    shadowOffset: { width: 0, height: 3 }, 
    shadowOpacity: 0.2, shadowRadius: 5, 
    elevation: 5, alignItems: "center", 
    padding: 10 
  },

  recipeImage: { width: 130, height: 100, borderRadius: 10 },
  
  recipeName: { fontSize: 16, fontWeight: "bold", marginTop: 10, textAlign: "center" },
});

export default ExploreRecipesScreen;
