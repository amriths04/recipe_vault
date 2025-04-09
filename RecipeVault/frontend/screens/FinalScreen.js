import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FinalScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🧾 FinalScreen</Text>
    </View>
  );
};

export default FinalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: '600',
  },
});
