import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function HomeScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Login"); // Navigate after 3 seconds
    }, 3000);
    return () => clearTimeout(timer); // Cleanup on unmount
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipe Vault</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007bff", // Blue background
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
});
