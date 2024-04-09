// CustomHeader.js
import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { auth, database } from './config/firebase';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';

// HeaderLeft Component for the Notification Bell
export const HeaderLeft = () => (
  <TouchableOpacity onPress={() => alert('Notifications')}>
    <Image source={require('./assets/icons/bell.png')} 
    style={[styles.icon, {tintColor: 'gray'}]} />
  </TouchableOpacity>
);

 // HeaderRight Component for the Logout Button
 export const HeaderRight = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    signOut(auth).then(() => {
      // Sign-out successful
      navigation.navigate('Welcome');
      console.log('Logout successful');
    }).catch((error) => {
      Alert.alert("Logout Error", error.message);
    });
  };

  return (
    <TouchableOpacity onPress={handleLogout}>
      <Image source={require('./assets/icons/logout.png')} style={[styles.icon, {tintColor: 'gray' }]} />
    </TouchableOpacity>
  );
}; 

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
    marginHorizontal: 30,
  },
});
