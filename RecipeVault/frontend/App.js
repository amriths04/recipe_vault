import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import AppNavigator from "./navigation/AppNavigator";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { SafeAreaProvider } from "react-native-safe-area-context"; // ✅ ADD THIS

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <StatusBar hidden={true} />
            <AppNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
