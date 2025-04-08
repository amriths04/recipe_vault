import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function OrderModal({
  visible,
  onClose,
  selectedList,
  isDarkMode,
  priceDetails,
  loadingPrice,
}) {
  const navigation = useNavigation();

  const groupedIngredients = selectedList.reduce((acc, item) => {
    if (!acc[item.recipeName]) {
      acc[item.recipeName] = [];
    }
    acc[item.recipeName].push(item);
    return acc;
  }, {});

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
            style={[
              styles.modalTitle,
              isDarkMode && { color: "white" },
            ]}
          >
            Selected Ingredients 🧾
          </Text>
          <ScrollView style={{ maxHeight: 400 }}>
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

                <View style={styles.table}>
                  <View style={styles.tableRowHeader}>
                    <Text style={[styles.tableCell, styles.headerCell, isDarkMode && styles.headerDark]}>Ingredient</Text>
                    <Text style={[styles.tableCell, styles.headerCell, isDarkMode && styles.headerDark]}>Qty</Text>
                    <Text style={[styles.tableCell, styles.headerCell, isDarkMode && styles.headerDark]}>Rate</Text>
                    <Text style={[styles.tableCell, styles.headerCell, isDarkMode && styles.headerDark]}>Price</Text>
                  </View>

                  {priceDetails.items.map((item, index) => (
                    <View key={index} style={[styles.tableRow, isDarkMode && { backgroundColor: "#2a2a2a" }]}>
                      <Text style={[styles.tableCell, { color: isDarkMode ? "#ddd" : "#333" }]}>{item.name}</Text>
                      <Text style={[styles.tableCell, { color: isDarkMode ? "#ddd" : "#333" }]}>{item.quantity}</Text>
                      <Text style={[styles.tableCell, { color: isDarkMode ? "#ddd" : "#333" }]}>₹{item.pricePerUnit}</Text>
                      <Text style={[styles.tableCell, { color: isDarkMode ? "#ddd" : "#333" }]}>₹{item.price}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}
          </ScrollView>

          {!loadingPrice && priceDetails && (
            <View style={styles.totalContainer}>
              <Text
                style={[
                  styles.totalText,
                  isDarkMode && { color: "#fff" },
                ]}
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
                  price: priceDetails?.totalPrice || 0,
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
    backgroundColor: "#eee",
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  tableCell: {
    flex: 1,
    padding: 6,
    textAlign: "center",
    fontSize: 13,
  },
  headerCell: {
    fontWeight: "bold",
  },
  headerDark: {
    backgroundColor: "#333",
    color: "#fff",
  },
});
