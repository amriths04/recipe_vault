import React, { useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { getShoppingList, removeFromShoppingList } from "../services/bookmarkService";
import { AuthContext } from "../context/AuthContext";
import { Checkbox, Button, Menu, Provider } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";

export default function ShoppingListScreen({ navigation }) {
  const { isDarkMode } = useTheme();
  const { user, token } = useContext(AuthContext);

  const [shoppingList, setShoppingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState({});
  const [menuVisible, setMenuVisible] = useState({});
  const [selectedAdults, setSelectedAdults] = useState({});
  const [selectedKids, setSelectedKids] = useState({});

  const adultOptions = [0, 1, 2, 3, 4, 5];
  const kidOptions = [0, 1, 2, 3, 4, 5];

  const fetchShoppingList = async () => {
    setLoading(true);
    try {
      const res = await getShoppingList(token);
      if (res && res.shoppingList) {
        setShoppingList(res.shoppingList);
      } else {
        console.error("❌ Failed to fetch shopping list");
        setShoppingList([]);
      }
    } catch (error) {
      console.error("❌ API Error:", error.message);
      setShoppingList([]);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchShoppingList();
    }, [token])
  );

  const toggleSelection = (recipeId) => {
    setSelectedItems((prev) => ({
      ...prev,
      [recipeId]: !prev[recipeId],
    }));
  };

  const handleRemoveSelected = async () => {
    const selectedRecipeIds = Object.keys(selectedItems).filter((id) => selectedItems[id]);

    if (selectedRecipeIds.length === 0) {
      alert("Please select at least one recipe to remove!");
      return;
    }

    try {
      const res = await removeFromShoppingList(user._id, selectedRecipeIds);
      if (res && res.shoppingList) {
        setSelectedItems({});
        await fetchShoppingList();
      } else {
        alert("Failed to remove items.");
      }
    } catch (error) {
      console.error("Error removing from shopping list:", error.message);
      alert("Something went wrong.");
    }
  };

  const handleCalculateIngredients = () => {
    const selectedRecipeIds = Object.keys(selectedItems).filter((id) => selectedItems[id]);
    if (selectedRecipeIds.length === 0) {
      alert("Please select at least one recipe to calculate!");
      return;
    }

    const payload = selectedRecipeIds.map((id) => ({
      recipeId: id,
      adults: selectedAdults[id] ?? 0,
      kids: selectedKids[id] ?? 0,
    }));

    navigation.navigate("CalculatedIngredients", { selectedRecipes: payload });
  };

  const renderDropdowns = (itemId) => (
    <View style={styles.dropdownRow}>
      <View style={styles.dropdownBox}>
        <Text style={[styles.dropdownLabel, isDarkMode && styles.darkText]}>Adults:</Text>
        <Menu
          visible={menuVisible[`adult-${itemId}`]}
          onDismiss={() =>
            setMenuVisible((prev) => ({ ...prev, [`adult-${itemId}`]: false }))
          }
          anchor={
            <Button
              mode="outlined"
              onPress={() =>
                setMenuVisible((prev) => ({ ...prev, [`adult-${itemId}`]: true }))
              }
            >
              {selectedAdults[itemId] ?? 0}
            </Button>
          }
        >
          {adultOptions.map((num) => (
            <Menu.Item
              key={num}
              onPress={() => {
                setSelectedAdults((prev) => ({ ...prev, [itemId]: num }));
                setMenuVisible((prev) => ({ ...prev, [`adult-${itemId}`]: false }));
              }}
              title={`${num}`}
            />
          ))}
        </Menu>
      </View>

      <View style={styles.dropdownBox}>
        <Text style={[styles.dropdownLabel, isDarkMode && styles.darkText]}>Kids:</Text>
        <Menu
          visible={menuVisible[`kid-${itemId}`]}
          onDismiss={() =>
            setMenuVisible((prev) => ({ ...prev, [`kid-${itemId}`]: false }))
          }
          anchor={
            <Button
              mode="outlined"
              onPress={() =>
                setMenuVisible((prev) => ({ ...prev, [`kid-${itemId}`]: true }))
              }
            >
              {selectedKids[itemId] ?? 0}
            </Button>
          }
        >
          {kidOptions.map((num) => (
            <Menu.Item
              key={num}
              onPress={() => {
                setSelectedKids((prev) => ({ ...prev, [itemId]: num }));
                setMenuVisible((prev) => ({ ...prev, [`kid-${itemId}`]: false }));
              }}
              title={`${num}`}
            />
          ))}
        </Menu>
      </View>
    </View>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, isDarkMode && styles.darkCard]}
      onPress={() => navigation.navigate("RecipeDetails", { recipeId: item._id })}
    >
      <View style={styles.row}>
        <Checkbox
          status={selectedItems[item._id] ? "checked" : "unchecked"}
          onPress={() => toggleSelection(item._id)}
        />
        <View style={styles.textContainer}>
          <Text style={[styles.title, isDarkMode && styles.darkText]}>
            {item.name || "Untitled Recipe"}
          </Text>
          <Text style={[styles.desc, isDarkMode && styles.darkText]}>
            {item.description || "No description available"}
          </Text>
        </View>
      </View>

      {renderDropdowns(item._id)}
    </TouchableOpacity>
  );

  return (
    <Provider>
      <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
        <Text style={[styles.header, isDarkMode && styles.darkText]}>Shopping List 🛒</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : shoppingList.length === 0 ? (
          <Text style={[styles.emptyText, isDarkMode && styles.darkText]}>
            Your shopping list is empty.
          </Text>
        ) : (
          <>
            <FlatList
              data={shoppingList}
              keyExtractor={(item) => item._id}
              renderItem={renderItem}
              contentContainerStyle={{ paddingBottom: 140 }}
            />
            <View style={styles.footerButtonsFixed}>
              <TouchableOpacity style={styles.calculateButton} onPress={handleCalculateIngredients}>
                <Text style={styles.buttonText}>Calculate Ingredients</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.removeButton} onPress={handleRemoveSelected}>
                <Text style={styles.buttonText}>Remove Selected</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: "#f8f8f8",
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "black",
  },
  darkText: {
    color: "white",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 40,
    color: "#555",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkCard: {
    backgroundColor: "#1e1e1e",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  desc: {
    fontSize: 14,
    marginTop: 4,
    color: "#555",
  },
  removeButton: {
    backgroundColor: "#ff4d4d",
    padding: 15,
    borderRadius: 10,
    marginVertical: 6,
    alignItems: "center",
  },
  calculateButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 10,
    marginBottom: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  dropdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  dropdownBox: {
    flex: 0.48,
  },
  dropdownLabel: {
    marginBottom: 4,
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  footerButtonsFixed: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#f8f8f8",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
});
