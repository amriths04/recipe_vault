import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons"; // Icons

const LandingPage = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const [expanded, setExpanded] = useState(false);

  // Toggle Sidebar
  const toggleSidebar = () => setExpanded(!expanded);

  // Collapse if clicked outside
  const handleOutsideClick = () => {
    if (expanded) setExpanded(false);
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsideClick}>
      <View style={styles.container}>
        {/* Sidebar Section */}
        <View style={[styles.sidebar, expanded ? styles.sidebarExpanded : styles.sidebarCollapsed]}>
          <View style={styles.bottomContainer}>
            {/* User Profile Icon */}
            <Ionicons name="person-circle-outline" size={50} color="white" style={styles.profileIcon} />

            {/* Username */}
            {expanded && <Text style={styles.username}>{user?.username || "Guest"}</Text>}

            {/* Home Button */}
            {expanded && (
              <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Home")}>
                <Text style={styles.navText}>Home</Text>
              </TouchableOpacity>
            )}

            {/* Logout Button */}
            {expanded && user && (
              <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            )}

            {/* Sidebar Toggle Button (Placed at Bottom) */}
            <TouchableOpacity style={styles.menuButton} onPress={toggleSidebar}>
              <Ionicons name={expanded ? "close" : "menu"} size={28} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <Text style={styles.welcomeText}>Welcome to Recipe Vault! 🚀</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LandingPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
  },
  sidebar: {
    padding: 10,
    backgroundColor: "#2c3e50",
    justifyContent: "flex-end",
    transition: "width 0.3s ease",
  },
  sidebarCollapsed: {
    width: 66, // Small width when collapsed
  },
  sidebarExpanded: {
    width: 100, // Wider when expanded
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
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#e74c3c",
    borderRadius: 5,
    marginBottom: 10,
  },
  logoutText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  menuButton: {
    padding: 10,
    backgroundColor: "#34495e", // Darker button
    borderRadius: 5,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
});
