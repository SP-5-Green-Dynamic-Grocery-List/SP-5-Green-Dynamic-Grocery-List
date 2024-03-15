//ItemDiscovery.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, Image, StyleSheet, Modal, FlatList, TouchableOpacity } from 'react-native';
import { ref, onValue, off } from 'firebase/database'; // Import Firebase database related functions
import  fetchProductData  from './index'; // Assuming fetchProductData is exported from './index'
import { auth, database } from './config/firebase';

const db = database;
function ItemDiscovery({ user }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userLists, setUserLists] = useState([]);
  const [searchedItem, setSearchedItem] = useState('');

  useEffect(() => {
    // Function to fetch product data based on search query
    const fetchData = async () => {
      try {
        const products = await fetchProductData(searchedItem, '30114'); // Assuming zip code is fixed for now
        console.log('Fetched products:', products);
        // Further processing of fetched products
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    if (searchedItem !== '') {
      fetchData();
    }

    const listsRef = ref(db, 'lists');
  
    const handleData = (snapshot) => {
      const listsData = snapshot.val();
      if (listsData) {
        // Iterate over each list
        const listsArray = Object.entries(listsData).map(([listId, list]) => ({
          ...list,
          listId: listId // Include the listId in the list object
        }));
  
        // Filter lists based on creatorUID
        const userLists = listsArray.filter(list => list.creatorUID === user.uid);
        setUserLists(userLists);
      } else {
        setUserLists([]);
      }
    };
  
    onValue(listsRef, handleData);
  
    // Cleanup function to detach the listener when component unmounts
    return () => {
      // Detach the listener
      off(listsRef, handleData);
    };
  }, [user, searchedItem]);

  // Function to handle adding item to a list
  const addToSelectedList = (list) => {
    // Here, you should update the Firebase database to add the selectedItem to the chosen list
    console.log('Adding item to list:', list);
    setModalVisible(false); // Close the modal after selecting the list
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search items..."
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
      <Button title="Search" onPress={() => setSearchedItem(searchQuery)} />
      {/* Your modal and list rendering code */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
  },
  // Your modal and list styles
});

export default ItemDiscovery;


