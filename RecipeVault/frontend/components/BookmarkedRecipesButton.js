import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

const BookmarkedRecipesButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.navigate("BookmarkedRecipesScreen")}
    >
      {/* Semi-transparent background */}
      <View style={styles.fallback}>
        <View style={styles.leftSide}>
          <Text style={styles.text}>📌 View Bookmarked Recipes</Text>
        </View>
        <View style={styles.rightSide} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    width: "104%",
    padding: 5,
    borderRadius: 10,
    marginVertical: 10,
    overflow: "hidden",
  },
  fallback: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Semi-transparent instead of Blur
    borderRadius: 10,
    borderWidth: 2, 
    borderColor:"black",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  leftSide: {
    flex: 1,
  },
  rightSide: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
});

export default BookmarkedRecipesButton;
