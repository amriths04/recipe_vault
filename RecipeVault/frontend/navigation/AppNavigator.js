import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import LandingPage from "../screens/LandingPage"; // New Page
import RegisterStep2 from "../screens/RegisterStep2";
const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Landing" component={LandingPage} />
        <Stack.Screen name="RegisterStep2" component={RegisterStep2} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
