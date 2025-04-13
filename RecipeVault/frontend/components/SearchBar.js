import React from "react";
import { TextInput, StyleSheet } from "react-native";

const SearchBar = ({ onSearch, style }) => {
  const handleChange = (text) => {
    // Call onSearch when text changes
    onSearch(text);
  };

  return (
    <TextInput
      style={[styles.searchInput, style]}
      placeholder="Search recipes..."
      onChangeText={handleChange}  // Trigger search on text change
    />
  );
};

const styles = StyleSheet.create({
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    fontSize: 16,
    color: "#333",
    paddingVertical: 8,
  },
  iconContainer: {
    padding: 8,
  },
});

export default SearchBar;
