import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "../context/ThemeContext";
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
  const { isDarkMode } = useTheme();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Landing" component={LandingPage} />
      <Stack.Screen name="RegisterStep2" component={RegisterStep2} />
      <Stack.Screen name="ShoppingList">
        {(props) => <ShoppingListScreen {...props} isDarkMode={isDarkMode} />}
      </Stack.Screen>
      <Stack.Screen name="Orders">
        {(props) => <OngoingOrdersScreen {...props} isDarkMode={isDarkMode} />}
      </Stack.Screen>
      <Stack.Screen name="Bookmarks">
        {(props) => <BookmarkedRecipesScreen {...props} isDarkMode={isDarkMode} />}
      </Stack.Screen>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="ExploreRecipes" component={ExploreRecipesScreen} />
      <Stack.Screen name="RecipeDetails" component={RecipeDetailsScreen} />
    </Stack.Navigator>
  );
}
