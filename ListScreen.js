// ListScreen.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Button, Modal, TextInput } from 'react-native';
import { ref, onValue, off, push, set } from 'firebase/database';
import { useRoute } from '@react-navigation/native';
import { database } from './config/firebase';


const db = database;

const ListScreen = ({ navigation }) => {
  const [lists, setLists] = useState([]);
  const route = useRoute();
  const user = route.params.user;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newUserListName, setNewUserListName] = useState('');

  useEffect(() => {
    const listsRef = ref(db, 'lists');

    const handleData = (snapshot) => {
      const listsData = snapshot.val();
      if (listsData) {
        const listsArray = Object.entries(listsData).map(([listId, list]) => ({
          ...list,
          listId: listId,
        }));
        //const userLists = listsArray.filter((list) => list.creatorUID === user.uid);
        const userLists = listsArray.filter((list) => {
          const collaboratorUIDs = Object.values(list.collaboratorUIDs || {});
          return list.creatorUID === user.uid || collaboratorUIDs.includes(user.uid);
        });
        setLists(userLists);
      } else {
        setLists([]);
      }
    };

    onValue(listsRef, handleData);

    return () => {
      off(listsRef, handleData);
    };
  }, [user]);

  const handleAddNewList = () => {
    const newListRef = push(ref(db, 'lists'));
    const newListData = {
      listName: newUserListName || `New List ${Date.now()}`, // Use provided name or a default name
      creatorUID: user.uid,
      collaboratorUIDs: [],
      items: [],
    };
  
    
    set(newListRef, newListData)
      .then(() => {
        console.log('New list added successfully');
        setIsModalVisible(false); // Close the modal
        setNewUserListName(''); // Reset the input field for the next use
      })
      .catch((error) => {
        console.error('Error adding new list:', error);
      });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={lists}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => navigation.navigate('List Details', { list: item })}
          >
            <Text style={styles.listItemText}>{item.listName}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.listId}
      />
      <Button title="Add New List" onPress={() => setIsModalVisible(true)} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              placeholder="Enter new list name"
              value={newUserListName}
              onChangeText={setNewUserListName}
            />
            <Button title="Add List" onPress={handleAddNewList} />
            <Button title="Cancel" onPress={() => setIsModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  listItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  listItemText: {
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', 
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '100%',
  },
});

export default ListScreen;
