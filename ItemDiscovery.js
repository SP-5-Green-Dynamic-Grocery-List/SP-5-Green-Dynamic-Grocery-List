//ItemDiscovery.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, Image, StyleSheet, Modal, FlatList, TouchableOpacity } from 'react-native';
import { ref, onValue, off, push } from 'firebase/database';
import fetchProductData from './index';
import { database } from './config/firebase';
import { useRoute } from '@react-navigation/native';

const db = database;

function ItemDiscovery({ navigation, route }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userLists, setUserLists] = useState([]);
  const [searchedItem, setSearchedItem] = useState('');
  const [fetchedProducts, setFretchedProducts] = useState();

  
  const { user } = route.params

  

  useEffect(() => {


    const fetchData = async () => {
      try {

        const products = await fetchProductData(searchedItem, '30114'); //has to be called with await and within useEffect
        console.log('Fetched products:', products);

        setFretchedProducts(products);
        
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

    if (selectedItem) {
      const { productId, description, regularPrice, frontImage } = selectedItem;
      const newItem = {
        productId: productId,
        name: description,
        price: regularPrice,
        frontImage: frontImage
      };
      console.log('newItem: ', newItem);

      const listRef = ref(db, `lists/${list.listId}/items`); // Adds items to the list.items list. doenst specify the name it goes in from within items becuase we let firebase assigne a unique id.
      push(listRef, newItem)
        .then(() => {
          console.log('Item added to list successfully: ', list.listName);
          setModalVisible(false); // Close modal after adding item
        })
        .catch((error) => {
          console.error('Error adding item to list: ', error);
        })
    }else{
      console.error('No item selected to add');
    }









    
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
      {fetchedProducts && (
        <FlatList
          data={fetchedProducts}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => {
                setSelectedItem(item); // Set the selected item
                setModalVisible(true); // Show the modal to choose from user's lists
              }}
            >
              <Image
                source={{ uri: item.frontImage }}
                style={styles.itemImage}
                resizeMode="contain"
              />
              <Text>{item.description}</Text>
              
              <Text>${item.regularPrice}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.productId}
        />
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
            <Button
              title="Cancel"
              onPress={() => setModalVisible(!modalVisible)}
            />
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
    maxHeight: '80%',
    width: '90%',
    minHeight: 200, 
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
    flexGrow: 1,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    alignItems: 'center',
  },
  itemImage: {
    width: '100%',
    height: 150,
    marginBottom: 10,
  },
});

export default ItemDiscovery;



