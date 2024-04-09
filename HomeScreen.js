import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { useRoute } from "@react-navigation/native";

export default function HomeScreen({ navigation, route }) {
  
  const { user } = route.params;
  console.log('this is uid in home: ');
  console.log(user.uid);
  
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome to DynamicGroceryList!</Text>
        <Image
          source={require('./assets/icons/shopping-cart.png')}
          style={styles.icon}
        />
      </View>
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
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  welcomeText: {
    color: '#333',
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 40,
  },
  icon: {
    width: 120,
    height: 120,
  },
});
