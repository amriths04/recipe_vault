import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const LandingPage = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <View>
      {user ? (
        <>
          <Text>Welcome, {user.username}!</Text>
          <Button title="Logout" onPress={logout} />
        </>
      ) : (
        <Text>You are not logged in.</Text>
      )}
    </View>
  );
};

export default LandingPage;
