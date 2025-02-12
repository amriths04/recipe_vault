import React, { useContext } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";

const UserIcon = () => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();

  return (
    <TouchableOpacity 
      style={styles.iconWrapper} 
      onPress={() => navigation.navigate("Profile")}
    >
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
    width: 45,
    height: 45,
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
