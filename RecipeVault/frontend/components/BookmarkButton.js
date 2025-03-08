import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const BookmarkButton = ({ isBookmarked, onToggle }) => {
  return (
    <TouchableOpacity 
      style={[styles.button, isBookmarked ? styles.bookmarked : styles.unbookmarked]} 
      onPress={onToggle}
    >
      <Text style={styles.text}>{isBookmarked ? "Unbookmark" : "Bookmark"}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  bookmarked: {
    backgroundColor: "#e74c3c", // Red for unbookmark
  },
  unbookmarked: {
    backgroundColor: "#3498db", // Blue for bookmark
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default BookmarkButton;
