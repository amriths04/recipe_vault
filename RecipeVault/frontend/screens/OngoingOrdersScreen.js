import { View, Text, StyleSheet } from "react-native";

export default function OngoingOrdersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ongoing Orders 🚚</Text>
      <Text style={styles.subtitle}>Your orders are on the way!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
  },
});
