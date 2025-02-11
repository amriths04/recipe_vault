import React, { useState, useContext, useRef } from "react";
import { View, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const FloatingMenu = ({ navigation }) => {
  const { logout } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef(null); // Store timeout reference

  const togglePanel = () => {
    setIsVisible(true); // Show panel

    // Set timeout to auto-close in 3 sec
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 3000);
  };

  const closePanel = () => {
    clearTimeout(timeoutRef.current); // Clear auto-close timeout if closed manually
    setIsVisible(false);
  };

  return (
    <TouchableWithoutFeedback onPress={closePanel}>
      <View style={styles.container}>
        {/* Floating Button (Three Dots or X) */}
        <TouchableOpacity style={styles.floatingButton} onPress={togglePanel}>
          <Ionicons name={isVisible ? "close" : "ellipsis-horizontal"} size={22} color="white" />
        </TouchableOpacity>

        {/* Bottom Panel - Two Row Grid */}
        {isVisible && (
          <View style={[styles.panel, { backgroundColor: isDarkMode ? "#222" : "#2c3e50" }]}>
            <View style={styles.row}>
              <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("Home")}>
                <Ionicons name="home-outline" size={26} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("Bookmarks")}>
                <MaterialCommunityIcons name="bookmark-outline" size={26} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("ShoppingList")}>
                <MaterialCommunityIcons name="cart-outline" size={26} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.row}>
              <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("Orders")}>
                <MaterialCommunityIcons name="truck-outline" size={26} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} onPress={toggleTheme}>
                <Ionicons name={isDarkMode ? "sunny-outline" : "moon-outline"} size={26} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} onPress={logout}>
                <MaterialCommunityIcons name="logout" size={26} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default FloatingMenu;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 15,
    left: 15,
    zIndex: 20,
  },
  floatingButton: {
    width: 40,
    height: 40,
    backgroundColor: "#3498db",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  panel: {
    position: "absolute",
    bottom: 50,
    left: -10,
    padding: 8,
    borderRadius: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  iconButton: {
    width: 40,
    height: 40,
    backgroundColor: "#34495e",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
});
