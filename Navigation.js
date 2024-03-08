// Navigation.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, TouchableOpacity} from 'react-native';
import { HeaderLeft, HeaderRight } from './CustomHeader';

import HomeScreen from './HomeScreen';
import ListScreen from './ListScreen';
import ProfileScreen from './ProfileScreen';
import WelcomeScreen from './WelcomeScreen';
import LoginScreen from './LoginScreen';
import ItemDiscovery from './ItemDiscovery';
import CreateAccountScreen from './CreateAccountScreen';
import CreateListScreen from './CreateListScreen';
import ListDetailsScreen from './ListDetailsScreen';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs({ user }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size, color }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = require('./assets/icons/home.png');
          } else if (route.name === 'List') {
            iconName = require('./assets/icons/list.png');
          } else if (route.name === 'Profile') {
            iconName = require('./assets/icons/user.png');
          } else if (route.name === 'Search') {
            iconName = require('./assets/icons/search.png');
          }
          return <Image source={iconName} style={{ width: size, height: size, tintColor: color }} />;
        },
        tabBarActiveTintColor: '#A9C4EE',
        tabBarInactiveTintColor: 'gray',
        headerLeft: () => <HeaderLeft />,
        headerRight: () => <HeaderRight onLogout={() => console.log('Handle logout')} />,
        headerShown: true, // Ensure the header is shown for tabs
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} initialParams={{ user }} />
      <Tab.Screen name="List" component={ListScreen} initialParams={{ user }} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Search" component={ItemDiscovery} />
    </Tab.Navigator>
  );
}


function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: true }} />
        <Stack.Screen name="Create Account" component={CreateAccountScreen} options={{headerShown: true}} />
        <Stack.Screen name="Add List" component={CreateListScreen} options={{headerShown: true}} />
        <Stack.Screen name= "List Details" component={ListDetailsScreen} options={{headerShown: true}}/>
        {/* The main app flow in the bottom tabs */}
        <Stack.Screen 
          name="Home" 
          component={MyTabs} 
          options={{ headerShown: false }}/>
        <Stack.Screen name= "Item Discovery" component={ItemDiscovery} options={{headerShown: true}} />
        <Stack.Screen name= "Profile Screen" component={ProfileScreen} options={{headerShown: true}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigation;
