import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import { fetchRecipeById } from "../services/recipeService";

export default function CalculatedIngredientsScreen({ route }) {
  const { selectedRecipes } = route.params;
  const { isDarkMode } = useTheme();
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [calculatedData, setCalculatedData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const results = [];

      for (const { recipeId, adults, kids } of selectedRecipes) {
        const recipe = await fetchRecipeById(recipeId, token);
        if (!recipe) continue;

        const multiplier = adults + kids * 0.5;

        const adjustedIngredients = recipe.ingredients.map((ing) => {
          const baseQty = parseFloat(ing.quantity);
          const adjustedQty = isNaN(baseQty)
            ? "N/A"
            : (baseQty * multiplier).toFixed(2);

          return {
            name: ing.name,
            quantity: adjustedQty,
            notes: ing.notes || "",
          };
        });

        results.push({
          name: recipe.name,
          description: recipe.description,
          ingredients: adjustedIngredients,
        });
      }

      setCalculatedData(results);
      setLoading(false);
    };

    fetchData();
  }, [selectedRecipes, token]);

  if (loading) {
    return (
      <View style={[styles.centered, isDarkMode && styles.darkContainer]}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={[styles.loadingText, isDarkMode && styles.darkText]}>
          Calculating ingredients...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.header, isDarkMode && styles.darkText]}>
        Calculated Ingredients 🧮
      </Text>

      {calculatedData.length === 0 ? (
        <Text style={[styles.emptyText, isDarkMode && styles.darkText]}>
          No recipes could be processed.
        </Text>
      ) : (
        calculatedData.map((recipe, index) => (
          <View
            key={index}
            style={[styles.recipeCard, isDarkMode && styles.darkCard]}
          >
            <Text style={[styles.recipeName, isDarkMode && styles.darkText]}>
              {recipe.name}
            </Text>
            <Text style={[styles.recipeDesc, isDarkMode && styles.darkText]}>
              {recipe.description}
            </Text>

            {recipe.ingredients.map((ing, idx) => (
              <View key={idx} style={styles.ingredientRow}>
                <Text
                  style={[styles.ingredientText, isDarkMode && styles.darkText]}
                >
                  • {ing.name}: {ing.quantity}
                  {ing.notes ? ` (${ing.notes})` : ""}
                </Text>
              </View>
            ))}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: "#f9f9f9",
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "black",
  },
  darkText: {
    color: "white",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
    color: "#666",
  },
  recipeCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
  },
  darkCard: {
    backgroundColor: "#1e1e1e",
  },
  recipeName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "black",
  },
  recipeDesc: {
    fontSize: 14,
    marginBottom: 10,
    color: "#666",
  },
  ingredientRow: {
    marginBottom: 6,
  },
  ingredientText: {
    fontSize: 15,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
});
