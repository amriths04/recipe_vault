import React, { useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // Make sure you have this installed

const SearchBar = ({ placeholder = "Search recipes or ingredients...", onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#888"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch} // Runs search when "Enter" is pressed
      />
      <TouchableOpacity onPress={handleSearch} style={styles.iconContainer}>
        <Icon name="search" size={20} color="#555" />
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    paddingHorizontal: 0,
    height: 45,
    marginHorizontal: 5,
    marginTop: 20,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 8,
  },
  iconContainer: {
    padding: 8,
  },
};

export default SearchBar;
