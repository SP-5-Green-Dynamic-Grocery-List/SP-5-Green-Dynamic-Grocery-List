// App.js
// This is a test comment 

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import AppNavigation from './Navigation';

export default function App() {
  return (
    <>
      <AppNavigation />
      <StatusBar style="auto" />
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

