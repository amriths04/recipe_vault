import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import SearchBar from "./SearchBar";
import UserIcon from "./UserIcon";

const { width } = Dimensions.get("window");

const Header = ({ onSearch }) => {  // Accept onSearch as a prop
  return (
    <View style={styles.headerContainer}>
      {/* Pass onSearch to SearchBar */}
      <SearchBar style={styles.searchBar} onSearch={onSearch} />

      {/* User Icon */}
      <UserIcon style={styles.userIcon} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start", // Keeps elements together
    paddingHorizontal: 15,
    paddingVertical: 40,
    marginTop: 0,
    width: width,
  },
  searchBar: {
    flex: 1, // Makes search bar take most of the space
    maxWidth: width, // Prevents stretching on large screens
  },
  userIcon: {
    marginLeft: 15, // Adds spacing between SearchBar & UserIcon
  },
});

export default Header;
