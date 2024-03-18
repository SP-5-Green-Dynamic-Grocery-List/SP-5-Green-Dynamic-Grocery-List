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
export const HeaderRight = ({ onLogout }) => (
  <TouchableOpacity onPress={onLogout}>
    <Image source={require('./assets/icons/logout.png')} style={styles.icon} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
    marginHorizontal: 30,
  },
});
