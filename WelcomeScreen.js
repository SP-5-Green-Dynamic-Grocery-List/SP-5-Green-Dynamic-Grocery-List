import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet, Text, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function WelcomeScreen({ navigation }) {
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial opacity for the overlay gradient

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.2)', 'rgba(135, 180, 255, 0.8)']}
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
          colors={['rgba(135, 206, 235, 0.8)', 'rgba(255, 255, 255, 0.2)']}
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
