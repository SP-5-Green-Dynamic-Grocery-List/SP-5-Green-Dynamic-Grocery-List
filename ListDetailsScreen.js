// ListDetailsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList, Image, TouchableOpacity, Modal, TextInput } from 'react-native';
import { ref, push, onValue, off } from 'firebase/database';
import { database } from './config/firebase'; 

const ListDetailsScreen = ({ route, navigation }) => {
  console.log('made it to details screen');
  const { list } = route.params;
  const [items, setItems] = useState([]);
  const [collaborators, setCollaborators] = useState(list.collaboratorUIDs || []);
  const [newCollaborator, setNewCollaborator] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  console.log('beforeUse');
  useEffect(() => {
    console.log('made it to useeffect');
    const listRef = ref(database, `lists/${list.listId}/items`);
    const onListChange = onValue(listRef, (snapshot) => {
      const data = snapshot.val();
      const itemList = data ? Object.values(data) : [];
      setItems(itemList);
    });

    console.log('databaseList: ',list.collaboratorUIDs)
    setCollaborators(list.collaboratorUIDs);

    
    console.log('List of Collaborators:', collaborators);

    return () => {
      off(listRef, 'value', onListChange);
    };
  }, [list.listId, list.collaboratorUIDs, collaborators]);

  const addCollaborator = () => {
    console.log('attempting to add: ', newCollaborator);
    const usersRef = ref(database, 'users');
    console.log('got userRef');
    // Check if the entered email exists in the users node
    onValue(usersRef, (snapshot) => {
      const userData = snapshot.val();
      const userEmails = Object.values(userData || {});
      const user = userEmails.find((userData) => userData.email === newCollaborator);
      console.log('about to test user');
      // If user exists, add their UID to the collaboratorUIDs list
      if (user) {
        console.log('user passed');
        const listRef = ref(database, `lists/${list.listId}/collaboratorUIDs`);
        push(listRef, user.UID); 
        console.log('pushed: ', user.UID);
        setNewCollaborator(''); // Clear input field after adding
      } else {
        console.log('User not found');
        
      }
    });
  };
  


  return (
    <View style={styles.container}>
      <Text>Description: {list.description}</Text>
      <Text style={styles.title}>List Name: {list.listName}</Text>
      <Text>Collaborators:</Text>
      <View>
        {list.collaboratorUIDs && Object.values(list.collaboratorUIDs).map((collaborator, index) => (
          <Text key={index}>{collaborator}</Text>
        ))}
        <Button title="Add Collaborator" onPress={() => setModalVisible(true)} />
      </View>
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
          >
            <Image
              source={{ uri: item.frontImage }}
              style={styles.itemImage}
              resizeMode="contain"
            />
            <Text>{item.name}</Text>
            <Text>${item.price}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.productId}
      />
      <Button title="Back" onPress={() => navigation.goBack()} />

      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              placeholder="Enter new collaborator's email"
              value={newCollaborator}
              onChangeText={setNewCollaborator}
            />
            <Button title="Add Collaborator" onPress={addCollaborator} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    alignItems: 'center',
  },
  itemImage: {
    width: 100,
    height: 100,
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

export default ListDetailsScreen;


