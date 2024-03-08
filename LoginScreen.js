import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth(); // Get the authentication instance

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('Login successful');


        const user = userCredential.user;

        
        navigation.navigate('Home', { user });
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
      <Text style={styles.title}>Login</Text>
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
          <Button title="Login" onPress={handleLogin} />
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

export default LoginScreen;
