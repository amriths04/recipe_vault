import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"; // Icons

const Sidebar = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useTheme(); // Use theme context
  const [expanded, setExpanded] = useState(false);

  const toggleSidebar = () => setExpanded(!expanded);
  const handleOutsideClick = () => {
    if (expanded) setExpanded(false);
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsideClick}>
      <View
        style={[
          styles.sidebar,
          expanded ? styles.sidebarExpanded : styles.sidebarCollapsed,
          { backgroundColor: isDarkMode ? "#1c1c1c" : "#2c3e50" }, // Apply theme
        ]}
      >
        <View style={styles.bottomContainer}>
          {/* User Profile Icon */}
          <Ionicons name="person-circle-outline" size={50} color="white" style={styles.profileIcon} />

          {/* Username */}
          {expanded && <Text style={styles.username}>{user?.username || "Guest"}</Text>}

          {/* Home Button */}
          {expanded && (
            <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Home")}>
              <Text style={styles.navText}>🏠</Text>
            </TouchableOpacity>
          )}

          {/* View Bookmarked Recipes */}
          {expanded && (
            <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Bookmarks")}>
              <MaterialCommunityIcons name="bookmark-outline" size={20} color="white" />
              <Text style={styles.navText}></Text>
            </TouchableOpacity>
          )}

          {/* Shopping List */}
          {expanded && (
            <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("ShoppingList")}>
              <MaterialCommunityIcons name="cart-outline" size={20} color="white" />
              <Text style={styles.navText}></Text>
            </TouchableOpacity>
          )}

          {/* Ongoing Orders */}
          {expanded && (
            <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Orders")}>
              <MaterialCommunityIcons name="truck-outline" size={20} color="white" />
              <Text style={styles.navText}></Text>
            </TouchableOpacity>
          )}

          {/* Dark Mode Toggle */}
          {expanded && (
            <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
              <Text style={styles.navText}>{isDarkMode ? "🌞" : "🌙"}</Text>
            </TouchableOpacity>
          )}

<TouchableOpacity style={styles.logoutButton} onPress={logout}>
  <MaterialCommunityIcons name="logout" size={24} color="white" />
</TouchableOpacity>


          {/* Sidebar Toggle Button */}
          <TouchableOpacity style={styles.menuButton} onPress={toggleSidebar}>
            <Ionicons name={expanded ? "close" : "menu"} size={28} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Sidebar;

const styles = StyleSheet.create({
  sidebar: {
    padding: 10,
  },
  sidebarCollapsed: {
    width: 66,
  },
  sidebarExpanded: {
    width: 100,
  },
  bottomContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
    paddingBottom: 20,
  },
  profileIcon: {
    marginBottom: 10,
  },
  username: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 15,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#3498db",
    borderRadius: 5,
    marginBottom: 10,
  },
  navText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  logoutButton: {
    width: 40,  
    height: 40,  
    backgroundColor: "#e74c3c",  
    borderRadius: 5,  
    alignItems: "center",  
    justifyContent: "center",  
    marginBottom: 10,  
    display: "flex",  
  },
  
  
  themeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#34495e",
    borderRadius: 5,
    marginBottom: 10,
  },
  menuButton: {
    padding: 10,
    backgroundColor: "#34495e",
    borderRadius: 5,
  },
});
