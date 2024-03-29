import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet, Text, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth, database } from './config/firebase';
import { useRoute } from "@react-navigation/native"

export default function WelcomeScreen({ navigation }) {
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial opacity for the overlay gradient

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  const handleLogin = () => {
    email = 'login@test.com'
    password = 'password'
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('Login successful');


        const user = userCredential.user;
        console.log('userIDfromSKIP');
        console.log(user.uid);
        userID = user.uid;
        




        navigation.navigate('Home', { user: user });
      })
      .catch((error) => {
        // Handle registration error
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Login error:', errorMessage);
      });
  };



  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.2)', 'rgba(130, 160, 230, 0.8)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: fadeAnim, // Bind opacity to animated value
          },
        ]}
      >
        <LinearGradient
           colors={['rgba(115, 184, 235, 0.8)', 'rgba(255, 255, 255, 0.4)']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>
      <Text style={styles.welcomeText}>Dynamic Grocery App</Text>
      <View style={styles.space} />
      <Button
        title="Create Account"
        onPress={() => navigation.navigate('Create Account')}
      />
      <Button
        title="Login"
        onPress={() => navigation.navigate('Login')} 
      />
      <Button
        title="skip"

        onPress={handleLogin} />
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
