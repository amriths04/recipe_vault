import React, { useState, useContext, useCallback } from "react";
import {View,Text,StyleSheet,FlatList,ActivityIndicator,TouchableOpacity,SafeAreaView,} from "react-native";
import { useTheme } from "../context/ThemeContext";
import {getShoppingList,removeFromShoppingList,} from "../services/bookmarkService";
import { AuthContext } from "../context/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import { Provider } from "react-native-paper";
import ShoppingListItem from "../components/ShoppingListItem";

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
    const selectedRecipeIds = Object.keys(selectedItems).filter(
      (id) => selectedItems[id]
    );

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
    const selectedRecipeIds = Object.keys(selectedItems).filter(
      (id) => selectedItems[id]
    );

    if (selectedRecipeIds.length === 0) {
      alert("Please select at least one recipe to calculate!");
      return;
    }

    const hasInvalidSelection = selectedRecipeIds.some((id) => {
      const adults = selectedAdults[id] ?? 0;
      const kids = selectedKids[id] ?? 0;
      return adults === 0 && kids === 0;
    });

    if (hasInvalidSelection) {
      alert("Each selected recipe must have at least 1 adult or 1 kid.");
      return;
    }

    const payload = selectedRecipeIds.map((id) => ({
      recipeId: id,
      adults: selectedAdults[id] ?? 0,
      kids: selectedKids[id] ?? 0,
    }));

    navigation.navigate("CalculatedIngredients", { selectedRecipes: payload });
  };

  const renderItem = ({ item }) => (
    <ShoppingListItem
      item={item}
      isDarkMode={isDarkMode}
      selected={selectedItems[item._id]}
      onToggleSelect={toggleSelection}
      selectedAdults={selectedAdults}
      selectedKids={selectedKids}
      setSelectedAdults={setSelectedAdults}
      setSelectedKids={setSelectedKids}
      menuVisible={menuVisible}
      setMenuVisible={setMenuVisible}
      navigation={navigation}
      adultOptions={adultOptions}
      kidOptions={kidOptions}
    />
  );

  return (
    <Provider>
      <SafeAreaView
        style={[styles.container, isDarkMode && styles.darkContainer]}
      >
        <Text style={[styles.header, isDarkMode && styles.darkText]}>
          Shopping List 🛒
        </Text>

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
            <View style={styles.footerButtonsFixed(isDarkMode)}>
              <TouchableOpacity
                style={styles.calculateButton(isDarkMode)}
                onPress={handleCalculateIngredients}
              >
                <Text style={styles.buttonText}>Calculate Ingredients</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeButton(isDarkMode)}
                onPress={handleRemoveSelected}
              >
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
  removeButton: (isDarkMode) => ({
    backgroundColor: isDarkMode ? "#b00020" : "#ff4d4d",
    padding: 15,
    borderRadius: 10,
    marginVertical: 6,
    alignItems: "center",
  }),
  calculateButton: (isDarkMode) => ({
    backgroundColor: isDarkMode ? "#388e3c" : "#28a745",
    padding: 15,
    borderRadius: 10,
    marginBottom: 6,
    alignItems: "center",
  }),
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerButtonsFixed: (isDarkMode) => ({
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: isDarkMode ? "#1e1e1e" : "#f8f8f8",
    borderTopWidth: 1,
    borderTopColor: isDarkMode ? "#444" : "#ccc",
  }),
});
