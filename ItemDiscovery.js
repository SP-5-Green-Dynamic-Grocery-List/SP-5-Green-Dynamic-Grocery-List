//ItemDiscovery.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, Image, StyleSheet, Modal, FlatList, TouchableOpacity } from 'react-native';
import { ref, onValue, off } from 'firebase/database'; // Import Firebase database related functions
import fetchProductData from './index'; // Assuming fetchProductData is exported from './index'
import { database } from './config/firebase';
import { useRoute } from '@react-navigation/native';

const db = database;

function ItemDiscovery({ navigation, route }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userLists, setUserLists] = useState([]);
  const [searchedItem, setSearchedItem] = useState('');

  
  const { user } = route.params

  

  useEffect(() => {


    const fetchData = async () => {
      try {

        const products = await fetchProductData(searchedItem, '30114'); //has to be called with await and within useEffect
        console.log('Fetched products:', products);
        
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
        console.log('lists: ', listsData);
        // Iterate over each list in db
        const listsArray = Object.entries(listsData).map(([listId, list]) => ({ ...list, listId: listId }));
        
        const userLists = listsArray.filter(list => list.creatorUID === user.uid); 
        
        setUserLists(userLists);
        console.log('some user lists: ', userLists);
      } else {
        setUserLists([]);
        console.log('no user lists1');
      }

    };

    onValue(listsRef, handleData);
  
    // Cleanup function to detach the listener when component unmounts
    return () => {
      // Detach the listener
      off(listsRef, handleData);
    };
  }, [searchedItem, user]);

  
  const addToSelectedList = (list) => {
    
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
      {selectedItem && (
        <View style={styles.itemContainer}>
          <Text style={styles.itemText}>Name: {selectedItem.name}</Text>
          <Text style={styles.itemText}>Description: {selectedItem.description}</Text>
          <Text style={styles.itemText}>Price: {selectedItem.price}</Text>
        </View>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <FlatList
              data={userLists}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.listItem}
                  onPress={() => addToSelectedList(item)}
                >
                  <Text>{item.listName}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.listId}
            />
            <Button title="Cancel" onPress={() => setModalVisible(!modalVisible)} />
          </View>
        </View>
      </Modal>
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    alignItems: 'center',
  },
});

export default ItemDiscovery;



