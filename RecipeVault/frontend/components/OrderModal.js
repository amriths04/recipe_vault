import React, { useState, useContext, useEffect, useCallback } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { fetchRecipeIdsByNames } from "../services/recipeService"; // Importing the service

export default function OrderModal({
  visible,
  onClose,
  selectedList,
  isDarkMode,
  priceDetails,
  loadingPrice,
}) {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext); // Assuming user context is set up
  const [recipeIds, setRecipeIds] = useState([]);
  const [loading, setLoading] = useState(false); // Track loading state

  const groupedIngredients = selectedList.reduce((acc, item) => {
    if (!acc[item.recipeName]) {
      acc[item.recipeName] = [];
    }
    acc[item.recipeName].push(item);
    return acc;
  }, {});

  const recipeNames = Object.keys(groupedIngredients);

  // Fetch recipe IDs only once when recipe names change
  const getRecipeIds = useCallback(async () => {
    if (loading || recipeNames.length === 0 || recipeIds.length > 0) return; // Fetch only if not already fetched
    console.log("Fetching Recipe IDs...");
    setLoading(true);

    try {
      const result = await fetchRecipeIdsByNames(recipeNames);
      if (result && result.recipeIds) {
        const ids = result.recipeIds.map((item) => item.id);
        setRecipeIds(ids);
      } else {
        console.error("Failed to fetch recipe IDs");
      }
    } catch (error) {
      console.error("Error fetching recipe IDs:", error);
    } finally {
      setLoading(false); // Reset loading state after the request is finished
    }
  }, [loading, recipeNames, recipeIds]); // Add recipeIds as a dependency

  useEffect(() => {
    if (recipeNames.length > 0) {
      getRecipeIds(); // Fetch recipe IDs only when recipeNames is available
    }
  }, [getRecipeIds]); // Only call when getRecipeIds changes

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.modalBackdrop}>
        <View
          style={[
            styles.modalContainer,
            isDarkMode && styles.darkModalContainer,
          ]}
        >
          <Text
            style={[styles.modalTitle, isDarkMode && { color: "white" }]}
          >
            Selected Ingredients 🧾
          </Text>
          <ScrollView style={{ maxHeight: 400 }}>
            {/* Grouped Ingredients Section */}
            {Object.entries(groupedIngredients).map(
              ([recipeName, ingredients], idx) => (
                <View key={idx} style={styles.recipeSection}>
                  <Text
                    style={[
                      styles.recipeHeader,
                      isDarkMode && { color: "white" },
                    ]}
                  >
                    {recipeName}
                  </Text>
                  {ingredients.map((ing, i) => (
                    <Text
                      key={i}
                      style={[
                        styles.ingredientItem,
                        isDarkMode && { color: "#ddd" },
                      ]}
                    >
                      - {ing.name}: {ing.quantity}
                    </Text>
                  ))}
                </View>
              )
            )}

            {loadingPrice ? (
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 10,
                  color: isDarkMode ? "#aaa" : "#333",
                }}
              >
                Calculating price...
              </Text>
            ) : priceDetails ? (
              <View style={{ marginTop: 10 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    marginBottom: 6,
                    color: isDarkMode ? "white" : "#000",
                  }}
                >
                  Price Breakdown 💰
                </Text>

                {/* Price Breakdown Table */}
                <View style={styles.table}>
                  <View style={styles.tableRowHeader}>
                    <Text
                      style={[
                        styles.tableCell,
                        styles.headerCell,
                        isDarkMode && styles.headerDark,
                      ]}
                    >
                      Ingredient
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        styles.headerCell,
                        isDarkMode && styles.headerDark,
                      ]}
                    >
                      Qty
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        styles.headerCell,
                        isDarkMode && styles.headerDark,
                      ]}
                    >
                      Rate
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        styles.headerCell,
                        isDarkMode && styles.headerDark,
                      ]}
                    >
                      Price
                    </Text>
                  </View>

                  {priceDetails.items.map((item, index) => (
                    <View
                      key={index}
                      style={[
                        styles.tableRow,
                        isDarkMode && { backgroundColor: "#2a2a2a" },
                      ]}
                    >
                      <Text
                        style={[
                          styles.tableCell,
                          { color: isDarkMode ? "#ddd" : "#333" },
                        ]}
                      >
                        {item.name}
                      </Text>
                      <Text
                        style={[
                          styles.tableCell,
                          { color: isDarkMode ? "#ddd" : "#333" },
                        ]}
                      >
                        {item.quantity}
                      </Text>
                      <Text
                        style={[
                          styles.tableCell,
                          { color: isDarkMode ? "#ddd" : "#333" },
                        ]}
                      >
                        ₹{item.pricePerUnit}
                      </Text>
                      <Text
                        style={[
                          styles.tableCell,
                          { color: isDarkMode ? "#ddd" : "#333" },
                        ]}
                      >
                        ₹{item.price}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}
          </ScrollView>

          {!loadingPrice && priceDetails && (
            <View style={styles.totalContainer}>
              <Text
                style={[styles.totalText, isDarkMode && { color: "#fff" }]}
              >
                Total Price: ₹{priceDetails.totalPrice.toFixed(2)}
              </Text>
            </View>
          )}

          <View style={styles.modalButtons}>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.button, styles.cancelButton]}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                onClose();
                navigation.navigate("PaymentGateway", {
                  calculatedIngredients: priceDetails.items,
                  totalAmount: priceDetails.totalPrice,             // ✅ optional for backend
                  recipeIds: recipeIds, // ✅ Pass recipe IDs to the payment screen
                });
              }}
              style={[styles.button, styles.payButton]}
            >
              <Text style={styles.buttonText}>PAY</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxHeight: "85%",
  },
  darkModalContainer: {
    backgroundColor: "#1e1e1e",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#000",
  },
  recipeSection: {
    marginBottom: 20,
  },
  recipeHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  ingredientItem: {
    fontSize: 15,
    marginLeft: 10,
  },
  totalContainer: {
    marginTop: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  totalText: {
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "right",
    color: "#000",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#6c757d",
  },
  payButton: {
    backgroundColor: "#007bff",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  // 🧾 Table styles below
  table: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    overflow: "hidden",
    marginHorizontal: 5,
  },
  tableRowHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f1f1",
  },
  tableRow: {
    flexDirection: "row",
    padding: 8,
  },
  headerCell: {
    flex: 1,
    textAlign: "center",
    paddingVertical: 10,
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
    paddingVertical: 8,
    fontSize: 14,
  },
  headerDark: {
    backgroundColor: "#343a40",
    color: "white",
  },
});
