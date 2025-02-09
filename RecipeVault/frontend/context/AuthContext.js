import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Load user data when the app starts
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const savedToken = await AsyncStorage.getItem('userToken');
        const savedUser = await AsyncStorage.getItem('userInfo');
        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    loadUserData();
  }, []);

  // Login function
  const login = async (userData, authToken) => {
    try {
      await AsyncStorage.setItem('userToken', authToken);
      await AsyncStorage.setItem('userInfo', JSON.stringify(userData));
      setToken(authToken);
      setUser(userData);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userInfo');
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
