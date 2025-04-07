import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Checkbox } from "react-native-paper";
import { useTheme } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import { fetchRecipeById } from "../services/recipeService";

export default function CalculatedIngredientsScreen({ route }) {
  const { selectedRecipes } = route.params;
  const { isDarkMode } = useTheme();
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [calculatedData, setCalculatedData] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState({}); // store checked state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const results = [];

      for (const { recipeId, adults, kids } of selectedRecipes) {
        const recipe = await fetchRecipeById(recipeId, token);
        if (!recipe) continue;

        const multiplier = adults + kids * 0.5;

        const adjustedIngredients = recipe.ingredients.map((ing, idx) => {
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
          recipeId,
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

  const toggleIngredient = (id) => {
    setSelectedIngredients((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOrder = () => {
    const selectedList = [];

    calculatedData.forEach((recipe) => {
      recipe.ingredients.forEach((ing) => {
        if (selectedIngredients[ing.id]) {
          selectedList.push({
            recipeName: recipe.name,
            ingredient: ing.name,
            quantity: ing.quantity,
            notes: ing.notes,
          });
        }
      });
    });

    console.log("🛒 Selected Ingredients to Order:", selectedList);

    // You can trigger API call or navigate to next screen here
  };

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
    <View style={[styles.fullScreen, isDarkMode && styles.darkContainer]}>
      <ScrollView style={styles.container}>
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
                <View key={ing.id} style={styles.ingredientRow}>
                  <Checkbox
                    status={selectedIngredients[ing.id] ? "checked" : "unchecked"}
                    onPress={() => toggleIngredient(ing.id)}
                    color="#007bff"
                    uncheckedColor={isDarkMode ? "#bbb" : "#666"}
                  />
                  <Text
                    style={[styles.ingredientText, isDarkMode && styles.darkText]}
                  >
                    {ing.name}: {ing.quantity}
                    {ing.notes ? ` (${ing.notes})` : ""}
                  </Text>
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity style={styles.orderButton} onPress={handleOrder}>
        <Text style={styles.orderButtonText}>ORDER</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
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
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  ingredientText: {
    fontSize: 15,
    flexShrink: 1,
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
  orderButton: {
    backgroundColor: "#007bff",
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  orderButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
