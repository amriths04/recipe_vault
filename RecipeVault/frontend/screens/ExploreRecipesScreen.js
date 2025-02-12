import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";

const ExploreRecipesScreen = ({ navigation }) => {
  // Dummy data for now
  const recipes = [
    { id: "1", name: "Spaghetti Carbonara" },
    { id: "2", name: "Chicken Biryani" },
    { id: "3", name: "Mango Smoothie" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Explore Recipes</Text>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.recipeItem}
            onPress={() => navigation.navigate("RecipeDetails", { recipeId: item.id })}
          >
            <Text style={styles.recipeName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  recipeItem: { padding: 15, backgroundColor: "#f0f0f0", marginVertical: 5, borderRadius: 10 },
  recipeName: { fontSize: 18 },
});

export default ExploreRecipesScreen;
