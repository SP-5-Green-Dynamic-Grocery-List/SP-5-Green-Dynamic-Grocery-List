import React from 'react';
import { View, Button, StyleSheet, Text } from 'react-native'; // Import Text component

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Dynamic Grocery App</Text> 
      <View style={styles.space} /> 
      <Button
        title="Create Account"
        onPress={() => {
          // Leave this empty for now
        }}
      />

      <Button
        title="Login"
        onPress={() => navigation.navigate('Login')} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  welcomeText: {
    color: '#91B2C0',
    fontSize: 30, 
    fontWeight: 'bold', 
    textAlign: 'center',
    marginBottom: 20, 
  },
  space: {
    height: 20, 
  },
});