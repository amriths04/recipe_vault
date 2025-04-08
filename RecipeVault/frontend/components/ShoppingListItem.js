import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Checkbox, Button, Menu } from "react-native-paper";

export default function ShoppingListItem({
  item,
  isDarkMode,
  selected,
  onToggleSelect,
  selectedAdults,
  selectedKids,
  setSelectedAdults,
  setSelectedKids,
  menuVisible,
  setMenuVisible,
  navigation,
  adultOptions,
  kidOptions,
}) {
  const itemId = item._id;

  const renderDropdowns = () => (
    <View style={styles.dropdownRow}>
      <View style={styles.dropdownBox}>
        <Text style={[styles.dropdownLabel, isDarkMode && styles.darkText]}>Adults:</Text>
        <Menu
          visible={menuVisible[`adult-${itemId}`]}
          onDismiss={() => setMenuVisible((prev) => ({ ...prev, [`adult-${itemId}`]: false }))}
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
          onDismiss={() => setMenuVisible((prev) => ({ ...prev, [`kid-${itemId}`]: false }))}
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

  return (
    <TouchableOpacity
      style={[styles.card, isDarkMode && styles.darkCard]}
      onPress={() => navigation.navigate("RecipeDetails", { recipeId: item._id })}
    >
      <View style={styles.row}>
        <Checkbox
          status={selected ? "checked" : "unchecked"}
          onPress={() => onToggleSelect(itemId)}
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
      {renderDropdowns()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
  darkText: {
    color: "white",
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
});
