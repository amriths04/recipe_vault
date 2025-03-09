import React, { useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { getShoppingList, removeFromShoppingList } from "../services/bookmarkService";
import { AuthContext } from "../context/AuthContext";
import { Checkbox } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";

export default function ShoppingListScreen({ navigation }) {
  const { isDarkMode } = useTheme();
  const { user, token } = useContext(AuthContext);

  const [shoppingList, setShoppingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState({});

  // ✅ Fetch Shopping List (Reusable)
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

  // ✅ Auto-refresh on focus
  useFocusEffect(
    useCallback(() => {
      fetchShoppingList();
    }, [token])
  );

  // ✅ Toggle checkbox selection
  const toggleSelection = (recipeId) => {
    setSelectedItems((prev) => ({
      ...prev,
      [recipeId]: !prev[recipeId],
    }));
  };

  // ✅ Remove selected items from shopping list
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
        await fetchShoppingList(); // Force refresh from backend
      } else {
        alert("Failed to remove items.");
      }
    } catch (error) {
      console.error("Error removing from shopping list:", error.message);
      alert("Something went wrong.");
    }
  };

  // ✅ Render recipe card
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
            {item.description ? item.description : "No description available"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
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
            contentContainerStyle={{ paddingBottom: 20 }}
          />

          <TouchableOpacity style={styles.removeButton} onPress={handleRemoveSelected}>
            <Text style={styles.buttonText}>Remove Selected</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
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
    marginVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
