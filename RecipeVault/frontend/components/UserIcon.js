import React, { useContext } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";

const UserIcon = ({ onPress, style }) => {
  const { user } = useContext(AuthContext);

  return (
    <TouchableOpacity onPress={onPress} style={[styles.iconWrapper, style]}>
      {user && user.profile?.name ? (
        <Text style={styles.userInitial}>{user.profile.name[0].toUpperCase()}</Text>
      ) : (
        <Ionicons name="person-circle-outline" size={30} color="white" />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconWrapper: {
    width: 35,
    height:35,
    borderRadius: 22.5,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  userInitial: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default UserIcon;
