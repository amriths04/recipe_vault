import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { AuthContext } from "../context/AuthContext"; 

const ProfileScreen = () => {
  const { user } = useContext(AuthContext); 

  if (!user) {
    return <Text style={styles.errorText}>No user data available.</Text>;
  }

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "Not Provided";
    const date = new Date(dateString);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Profile</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Username:</Text>
        <Text style={styles.value}>{user.username}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Full Name:</Text>
        <Text style={styles.value}>{user.profile?.name || "Not Provided"}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user.email}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.value}>{user.phone || "Not Provided"}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Date of Birth:</Text>
        <Text style={styles.value}>{formatDate(user.profile?.dob)}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Location:</Text>
        <Text style={styles.value}>{user.profile?.location || "Not Provided"}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Account Created At:</Text>
        <Text style={styles.value}>{formatDate(user.createdAt)}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Last Updated At:</Text>
        <Text style={styles.value}>{formatDate(user.updatedAt)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  infoBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 50,
  },
});

export default ProfileScreen;
