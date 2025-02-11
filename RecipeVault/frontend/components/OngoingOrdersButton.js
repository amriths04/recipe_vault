import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

const OngoingOrdersButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.navigate("OngoingOrdersScreen")}
    >
      <View style={styles.fallback}>
        <Text style={styles.text}>🚚 Check Ongoing Orders</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "42%", // Half width to fit beside another button
    marginVertical: 5,
    marginHorizontal: "2%", // Same left & right margin
  },
  fallback: {
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Semi-transparent
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "black",
    padding: 15,
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
  },
});

export default OngoingOrdersButton;
