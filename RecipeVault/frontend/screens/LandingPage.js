import { View, Text, StyleSheet } from "react-native";

export default function LandingPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Landing Page!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
  },
});
