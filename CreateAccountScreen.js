// CreateAccountScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, database } from './config/firebase';

const CreateAccountScreen = ({ navigation }) => { // Pass navigation as a prop
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth(); // Get the authentication instance

  const handleRegistration = () => {
    // Use createUserWithEmailAndPassword method
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // On successful registration
        console.log('Registration successful');
        // Navigate to another screen after successful registration
        navigation.navigate('Home');
      })
      .catch((error) => {
        // Handle registration error
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Registration error:', errorMessage);
        
      });
  };

  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registration</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={text => setEmail(text)}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={text => setPassword(text)}
        value={password}
      />
      <View style={styles.buttonContainer}>
        <View style={[styles.button, { marginBottom: 10 }]}>
          <Button title="Login" onPress={handleRegistration} />
        </View>
        <View style={styles.button}>
          <Button title="Back" onPress={() => navigation.navigate('Welcome')} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    width: '100%',
  },
});

export default CreateAccountScreen;