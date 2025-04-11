import React, { useEffect, useState, useContext } from "react";
import {View,Text,StyleSheet,ScrollView,ActivityIndicator,TouchableOpacity,SafeAreaView,} from "react-native";
import { Checkbox } from "react-native-paper";
import { useTheme } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import { fetchRecipeById } from "../services/recipeService";
import { calculateOrderPrice } from "../services/orderService"; // ✅ NEW IMPORT
import OrderModal from "../components/OrderModal";

export default function CalculatedIngredientsScreen({ route }) {
  const { selectedRecipes } = route.params;
  const { isDarkMode } = useTheme();
  const { token } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [calculatedData, setCalculatedData] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [finalSelectedList, setFinalSelectedList] = useState([]);
  const [priceData, setPriceData] = useState(null); // ✅ NEW STATE

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const results = [];

      for (const { recipeId, adults, kids } of selectedRecipes) {
        const recipe = await fetchRecipeById(recipeId, token);
        if (!recipe) continue;

        const multiplier = adults + kids * 0.5;

        const adjustedIngredients = recipe.ingredients.map((ing, idx) => {
          const match = ing.quantity.match(/^([\d.,\/]+)\s*(.*)$/); // e.g., "1.5 cups" => ["1.5 cups", "1.5", "cups"]
          if (!match) {
            return {
              name: ing.name,
              quantity: ing.quantity, // Leave as is
              notes: ing.notes || "",
            };
          }
        
          let baseQty = match[1];
          const unit = match[2];
        
          // Handle fractions like "1/2"
          if (baseQty.includes("/")) {
            const parts = baseQty.split("/");
            baseQty = parseFloat(parts[0]) / parseFloat(parts[1]);
          } else {
            baseQty = parseFloat(baseQty.replace(",", ".")); // comma safety
          }
        
          const adjustedQty = (baseQty * multiplier).toFixed(2);
        
          return {
            name: ing.name,
            quantity: `${adjustedQty} ${unit}`.trim(), // Keep it clean
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
      const defaultSelected = {};
      results.forEach((recipe) => {
        recipe.ingredients.forEach((ing, idx) => {
          const key = `${recipe.recipeId}-${ing.name}-${idx}`;
          defaultSelected[key] = true;
        });
      });
      setSelectedIngredients(defaultSelected);
      setLoading(false);
    };

    fetchData();
  }, [selectedRecipes, token]);

  const toggleIngredient = (key) => {
    setSelectedIngredients((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleOrder = async () => {
    const selectedList = [];

    calculatedData.forEach((recipe) => {
      recipe.ingredients.forEach((ing, idx) => {
        const key = `${recipe.recipeId}-${ing.name}-${idx}`;
        if (selectedIngredients[key]) {
          selectedList.push({
            recipeName: recipe.name,
            name: ing.name,
            quantity: ing.quantity,
          });
        }
      });
    });

    setFinalSelectedList(selectedList);

    try {
      const response = await calculateOrderPrice(selectedList, token); // ✅ BACKEND CALL
      setPriceData(response); // ✅ Save response (like totalPrice)
      setModalVisible(true);
    } catch (error) {
      console.error("Price calculation failed:", error);
    }
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
    <SafeAreaView style={[styles.fullScreen, isDarkMode && styles.darkContainer]}>
      <View style={styles.contentWrapper}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}
        >
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
                <Text
                  style={[styles.recipeName, isDarkMode && styles.darkText]}
                >
                  {recipe.name}
                </Text>
                <Text style={[styles.recipeDesc, isDarkMode && styles.darkText]}>
                  {recipe.description}
                </Text>

                {recipe.ingredients.map((ing, idx) => {
                  const key = `${recipe.recipeId}-${ing.name}-${idx}`;
                  return (
                    <View key={key} style={styles.ingredientRow}>
                      <Checkbox
                        status={selectedIngredients[key] ? "checked" : "unchecked"}
                        onPress={() => toggleIngredient(key)}
                        color="#007bff"
                        uncheckedColor={isDarkMode ? "#bbb" : "#666"}
                      />
                      <Text
                        style={[
                          styles.ingredientText,
                          isDarkMode && styles.darkText,
                        ]}
                      >
                        {ing.name}: {ing.quantity}
                        {ing.notes ? ` (${ing.notes})` : ""}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ))
          )}
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.orderButton} onPress={handleOrder}>
            <Text style={styles.orderButtonText}>ORDER</Text>
          </TouchableOpacity>
        </View>
      </View>

      <OrderModal
  visible={modalVisible}
  onClose={() => {
    setModalVisible(false);
    setPriceData(null); // ⛔ Clear price data if user cancels
  }}
  selectedList={finalSelectedList}
  isDarkMode={isDarkMode}
  priceDetails={priceData}
/>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    position: "relative",
  },
  scrollContent: {
    paddingTop: 50,
    paddingHorizontal: 16,
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
  buttonContainer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: "transparent",
  },
  orderButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  orderButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 1,
  },
});
