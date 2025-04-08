import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

export default function OrderModal({
  visible,
  onClose,
  selectedList,
  isDarkMode,
}) {
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
          </ScrollView>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.button, styles.cancelButton]}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.payButton]}>
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
    maxHeight: "80%",
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
});
