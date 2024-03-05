// Homescreen.js
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity , Image} from 'react-native';


export default function HomeScreen({navigation}) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => console.log("Button Pressed")}>
        <Text style={styles.buttonText}>Add Authorized Users</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('List')}>
        <Text style={styles.buttonText}>Add items to Cart</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Welcome')}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff', 
  },
  button: {
    backgroundColor: '#A9C4EE', 
    padding: 15, 
    borderRadius: 5,
    margin: 5,
  },
  buttonText: {
    color: '#FFFF', 
    fontSize: 16, 
  },
  iconContainer: {
    position: 'absolute', // Use absolute positioning
    top: 10, // Distance from the top of the container
    left: 10, // Distance from the left of the container
  },
  icon: {
    width: 30, // Adjust size as needed
    height: 30, // Adjust size as needed
  },
});