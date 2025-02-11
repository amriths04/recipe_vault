import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <TouchableOpacity style={styles.button} onPress={toggleTheme}>
      <Ionicons name={theme === "light" ? "moon" : "sunny"} size={24} color="white" />
      <Text style={styles.text}>{theme === "light" ? "Dark Mode" : "Light Mode"}</Text>
    </TouchableOpacity>
  );
};

export default ThemeToggle;

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#34495e",
    borderRadius: 5,
    marginTop: 10,
  },
  text: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 14,
  },
});
