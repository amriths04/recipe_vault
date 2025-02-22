import React, { useContext } from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext"; // Dark Mode Support

const ProfileScreen = () => {
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useTheme(); // Get theme state

  if (!user) {
    return <Text style={[styles.errorText, isDarkMode && styles.darkText]}>No user data available.</Text>;
  }

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "Not Provided";
    const date = new Date(dateString);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* ✅ Dynamic Status Bar */}
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={isDarkMode ? "#1c1c1c" : "#fff"} />

      <Text style={[styles.heading, isDarkMode && styles.darkText]}>👤 Profile</Text>

      <View style={[styles.infoBox, isDarkMode && styles.darkInfoBox]}>
        <Text style={[styles.label, isDarkMode && styles.darkText]}>Username:</Text>
        <Text style={[styles.value, isDarkMode && styles.darkText]}>{user.username}</Text>
      </View>

      <View style={[styles.infoBox, isDarkMode && styles.darkInfoBox]}>
        <Text style={[styles.label, isDarkMode && styles.darkText]}>Full Name:</Text>
        <Text style={[styles.value, isDarkMode && styles.darkText]}>{user.profile?.name || "Not Provided"}</Text>
      </View>

      <View style={[styles.infoBox, isDarkMode && styles.darkInfoBox]}>
        <Text style={[styles.label, isDarkMode && styles.darkText]}>Email:</Text>
        <Text style={[styles.value, isDarkMode && styles.darkText]}>{user.email}</Text>
      </View>

      <View style={[styles.infoBox, isDarkMode && styles.darkInfoBox]}>
        <Text style={[styles.label, isDarkMode && styles.darkText]}>Phone:</Text>
        <Text style={[styles.value, isDarkMode && styles.darkText]}>{user.phone || "Not Provided"}</Text>
      </View>

      <View style={[styles.infoBox, isDarkMode && styles.darkInfoBox]}>
        <Text style={[styles.label, isDarkMode && styles.darkText]}>Date of Birth:</Text>
        <Text style={[styles.value, isDarkMode && styles.darkText]}>{formatDate(user.profile?.dob)}</Text>
      </View>

      <View style={[styles.infoBox, isDarkMode && styles.darkInfoBox]}>
        <Text style={[styles.label, isDarkMode && styles.darkText]}>Location:</Text>
        <Text style={[styles.value, isDarkMode && styles.darkText]}>{user.profile?.location || "Not Provided"}</Text>
      </View>

      <View style={[styles.infoBox, isDarkMode && styles.darkInfoBox]}>
        <Text style={[styles.label, isDarkMode && styles.darkText]}>Account Created At:</Text>
        <Text style={[styles.value, isDarkMode && styles.darkText]}>{formatDate(user.createdAt)}</Text>
      </View>

      <View style={[styles.infoBox, isDarkMode && styles.darkInfoBox]}>
        <Text style={[styles.label, isDarkMode && styles.darkText]}>Last Updated At:</Text>
        <Text style={[styles.value, isDarkMode && styles.darkText]}>{formatDate(user.updatedAt)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  darkContainer: { backgroundColor: "#1c1c1c" },

  heading: { fontSize: 26, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#2c3e50" },
  darkText: { color: "#fff" },

  infoBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  darkInfoBox: { borderBottomColor: "#444" },

  label: { fontSize: 16, fontWeight: "bold", color: "#555" },
  value: { fontSize: 16, color: "#333" },

  errorText: { fontSize: 18, color: "red", textAlign: "center", marginTop: 50 },
});

export default ProfileScreen;
