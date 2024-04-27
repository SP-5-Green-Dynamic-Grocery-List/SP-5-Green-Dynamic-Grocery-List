import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, Image, StyleSheet, Modal, FlatList, TouchableOpacity } from 'react-native';
import { ref, onValue, off, push, get } from 'firebase/database';
import fetchProductData from './index';
import { auth, database } from './config/firebase';

const db = database;

function ItemDiscovery({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [userLists, setUserLists] = useState([]);
  const [searchedItem, setSearchedItem] = useState('');
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const [userZipCode, setUserZipCode] = useState('30114');

  useEffect(() => {
    const userID = auth.currentUser?.uid;
    if (userID) {
      const userRef = ref(db, `users/${userID}`);
      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setUserZipCode(userData.zipCode);
        }
      }).catch((error) => {
        console.error('Error fetching user data:', error);
      });
    }

    const listsRef = ref(db, 'lists');
    onValue(listsRef, (snapshot) => {
      const listsData = snapshot.val() || {};
      const listsArray = Object.entries(listsData)
        .map(([key, value]) => ({ ...value, listId: key }))
        .filter(list => list.creatorUID === userID);
      setUserLists(listsArray);
    });

    return () => {
      off(listsRef);
    };
  }, []);

  useEffect(() => {
    if (searchedItem) {
      fetchProductData(searchedItem, userZipCode).then(setFetchedProducts).catch(console.error);
    }
  }, [searchedItem, userZipCode]);

  const addToSelectedList = (list) => {
    console.log('Adding item to list:', list);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search items..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="Search" onPress={() => setSearchedItem(searchQuery)} />
      <FlatList
        data={fetchedProducts}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => {
              setSelectedItem(item);
              setModalVisible(true);
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
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
