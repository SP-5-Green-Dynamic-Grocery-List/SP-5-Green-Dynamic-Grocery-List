import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { ref, onValue, off, get, push,} from 'firebase/database';
import { database } from './config/firebase';

const CreateAccountScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth(); // Get the authentication instance
  const db = database; // Get the database instance

  const handleRegistration = () => {
    const usersRef = ref(db, 'users');
    
    get(usersRef)
      .then((snapshot) => {
        const users = snapshot.val() || {};
        const existingUser = Object.values(users).find((user) => user.email === email);
        
        if (existingUser) {
          console.log('User already exists');
          return;
        }
  
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            console.log('Registration successful');
            const user = userCredential.user;
            const userData = {
              UID: user.uid,
              email: email,
              listIDs: {}
            };
  
            push(usersRef, userData)
              .then(() => {
                console.log('User added to the database');
                navigation.navigate('Home', { user: user });
              })
              .catch((error) => {
                console.error('Error adding user to the database:', error);
              });
          })
          .catch((error) => {
            console.error('Registration error:', error);
          });
      })
      .catch((error) => {
        console.error('Error checking if user exists:', error);
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        onChangeText={text => setEmail(text)}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        onChangeText={text => setPassword(text)}
        value={password}
      />
      <TouchableOpacity style={styles.button} onPress={handleRegistration}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <Text style={styles.linkText}>
        Already have an account?{' '}
        <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
          Login here
        </Text>
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 50,
    marginTop: -90,
    alignSelf: 'flex-start',
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
  button: {
    height: 50,
    width: 190,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: '#007bff',
    marginBottom: 30,
    marginTop: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
  linkText: {
    fontSize: 16,
    marginBottom: 10,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default CreateAccountScreen;
