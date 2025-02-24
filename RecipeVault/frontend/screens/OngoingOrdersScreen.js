import React, { useContext } from "react";
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import navigation hook
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext"; // Dark Mode Support

const ProfileScreen = () => {
  const { user, logout } = useContext(AuthContext);
  const { isDarkMode } = useTheme();
  const navigation = useNavigation(); // Initialize navigation

  if (!user) {
    return <Text style={[styles.errorText, isDarkMode && styles.darkText]}>No user data available.</Text>;
  }

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "Not Provided";
    const date = new Date(dateString);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  // Handle logout and navigate to LoginScreen
  const handleLogout = () => {
    logout(); // Perform logout
    navigation.replace("LoginScreen"); // Redirect to LoginScreen
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={isDarkMode ? "#1c1c1c" : "#fff"} />

      {/* Profile Heading */}
      <Text style={[styles.heading, isDarkMode && styles.darkText]}>👤 Profile</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={[styles.profileCard, isDarkMode && styles.darkProfileCard]}>
          <Text style={[styles.cardTitle, isDarkMode && styles.darkText]}>User Information</Text>

          {/* ✅ Grid Layout for User Info */}
          <View style={styles.gridContainer}>
            <ProfileInfo label="Username" value={user.username} isDarkMode={isDarkMode} />
            <ProfileInfo label="Full Name" value={user.profile?.name || "Not Provided"} isDarkMode={isDarkMode} />
            <ProfileInfo label="Email" value={user.email} isDarkMode={isDarkMode} />
            <ProfileInfo label="Phone" value={user.phone || "Not Provided"} isDarkMode={isDarkMode} />
            <ProfileInfo label="Date of Birth" value={formatDate(user.profile?.dob)} isDarkMode={isDarkMode} />
            <ProfileInfo label="Location" value={user.profile?.location || "Not Provided"} isDarkMode={isDarkMode} />
            <ProfileInfo label="Account Created" value={formatDate(user.createdAt)} isDarkMode={isDarkMode} />
            <ProfileInfo label="Last Updated" value={formatDate(user.updatedAt)} isDarkMode={isDarkMode} />
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

// 🔹 Profile Info Box (Now in Grid Layout)
const ProfileInfo = ({ label, value, isDarkMode }) => (
  <View style={[styles.infoBox, isDarkMode && styles.darkInfoBox]}>
    <Text style={[styles.label, isDarkMode && styles.darkText]}>{label}:</Text>
    <Text style={[styles.value, isDarkMode && styles.darkText]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  darkContainer: { backgroundColor: "#1c1c1c" },

  scrollContainer: { padding: 20, alignItems: "center" },

  // 🔹 Profile Heading
  heading: { 
    fontSize: 30, 
    fontWeight: "bold", 
    marginBottom: 40,
    marginTop: 40,  
    textAlign: "center", 
    color: "#2c3e50" 
  }, 
  darkText: { color: "#fff" },

  // ✅ Profile Card
  profileCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
    width: "100%",
    maxWidth: 400,
    marginBottom: 30,
  },
  darkProfileCard: { backgroundColor: "#2c2c2c", shadowColor: "#000" },

  cardTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15, color: "#2c3e50", textAlign: "center" },

  // ✅ Grid Layout for Profile Info
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  // ✅ Profile Info Box
  infoBox: {
    width: "48%", // Each row will have two items
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  darkInfoBox: { borderBottomColor: "#444" },

  label: { fontSize: 16, fontWeight: "bold", color: "#555" },
  value: { fontSize: 16, color: "#333" },

  errorText: { fontSize: 18, color: "red", textAlign: "center", marginTop: 50 },

  // 🔴 Centered Logout Button
  buttonContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoutButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    minWidth: "80%",
    alignItems: "center",
    shadowColor: "#e74c3c",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  logoutText: { color: "#fff", fontSize: 18, fontWeight: "bold", textAlign: "center" },
});

export default ProfileScreen;
