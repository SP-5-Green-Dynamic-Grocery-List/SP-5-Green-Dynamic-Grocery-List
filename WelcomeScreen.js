import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet, Text, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth, database } from './config/firebase';
import { useRoute } from "@react-navigation/native"

export default function WelcomeScreen({ navigation }) {
  const handleLogin = () => {
    const email = 'login@test.com';
    const password = 'password';
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('Login successful');
        const user = userCredential.user;
        console.log('userIDfromSKIP', user.uid);
        navigation.navigate('Home', { user: user });
      })
      .catch((error) => {
        console.error('Login error:', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Dynamic Grocery App</Text>
      <View style={styles.paginationContainer}>
        <Text style={styles.paginationDot}>•</Text>
        <Text style={styles.paginationDot}>•</Text>
        <Text style={styles.paginationDot}>•</Text>
      </View>
      <Button
        title="Sign In"
        onPress={() => navigation.navigate('Login')}
        color="#007bff" // Optional: Color for the button
      />
      <View style={styles.space} />
      <Button
        title="Skip"
        onPress={handleLogin}
        color="#50C878" // Optional: Color for the button
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    padding: 10,
  },
  welcomeText: {
    color: '#000', // Changed for better visibility on white background
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  paginationDot: {
    fontSize: 24,
    color: 'gray',
    marginHorizontal: 10,
  },
  space: {
    height: 20,
  },
});
