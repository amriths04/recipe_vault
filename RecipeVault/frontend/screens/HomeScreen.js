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
      {/* Recipe Book Effect */}
      <View style={styles.bookContainer}>
        <Text style={styles.title}>📖 Recipe Vault</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2c3e50", // Dark background like the sidebar
  },
  bookContainer: {
    width: 280,
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: "#f8f1e1", // Light parchment-like color
    borderRadius: 10,
    elevation: 5, // Shadow effect
    borderWidth: 2,
    borderColor: "#d2a679", // Light brown like an old book
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#3d2b1f", // Dark brown for classic feel
    textAlign: "center",
  },
});
