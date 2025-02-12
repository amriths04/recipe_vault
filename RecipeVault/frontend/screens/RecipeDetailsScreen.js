import { View, Text, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";

const RecipeDetailsScreen = () => {
  const route = useRoute();
  const { recipeId } = route.params; // Will use this to fetch actual recipe details later

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Recipe Details</Text>
      <Text>Showing details for recipe ID: {recipeId}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
});

export default RecipeDetailsScreen;
