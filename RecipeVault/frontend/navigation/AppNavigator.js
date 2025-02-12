import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import LandingPage from "../screens/LandingPage";
import RegisterStep2 from "../screens/RegisterStep2";
import ShoppingListScreen from "../screens/ShoppingListScreen";
import OngoingOrdersScreen from "../screens/OngoingOrdersScreen";
import BookmarkedRecipesScreen from "../screens/BookmarkedRecipesScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ExploreRecipesScreen from "../screens/ExploreRecipesScreen";
import RecipeDetailsScreen from "../screens/RecipeDetailsScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Landing" component={LandingPage} />
      <Stack.Screen name="RegisterStep2" component={RegisterStep2} />
      <Stack.Screen name="ShoppingList" component={ShoppingListScreen} />
      <Stack.Screen name="Orders" component={OngoingOrdersScreen} />
      <Stack.Screen name="Bookmarks" component={BookmarkedRecipesScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="ExploreRecipes" component={ExploreRecipesScreen} />
      <Stack.Screen name="RecipeDetails" component={RecipeDetailsScreen} />
    </Stack.Navigator>
  );
}
