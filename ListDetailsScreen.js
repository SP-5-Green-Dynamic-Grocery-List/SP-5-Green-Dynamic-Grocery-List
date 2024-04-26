// ListDetailsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList, Image, TouchableOpacity, Modal, TextInput } from 'react-native';
import { ref, onValue, off, get, push } from 'firebase/database';
import { database } from './config/firebase';

const ListDetailsScreen = ({ route, navigation }) => {
  console.log('made it to details screen');
  const { list } = route.params;
  const [items, setItems] = useState([]);
  const [collaborators, setCollaborators] = useState(list.collaboratorUIDs || []);
  const [newCollaborator, setNewCollaborator] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [collaboratorEmails, setCollaboratorEmails] = useState([]);
  
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

    // Fetch collaborator emails when collaborators change
    fetchCollaboratorEmails();

    return () => {
      off(listRef, 'value', onListChange);
    };
  }, [list.listId, list.collaboratorUIDs]);

  const getEmails = async (uids) => {
    console.log('Fetching emails for UIDs:', uids);
    const promises = uids.map(async (uid) => {
        try {
            const userEmailSnapshot = await get(ref(database, 'users'));
            const usersData = userEmailSnapshot.val();
            const user = Object.values(usersData).find(user => user.UID === uid);
            if (user && user.email) {
                return user.email;
            } else {
                console.log('Email not found for collaborator with UID:', uid);
                return null;
            }
        } catch (error) {
            console.error('Error fetching email for UID:', uid, error);
            return null;
        }
    });

    try {
        const emails = await Promise.all(promises);
        return emails.filter(email => email !== null); // Filter out null values
    } catch (error) {
        console.error('Error fetching collaborator emails:', error);
        return [];
    }
};

  
  
  
  const fetchCollaboratorEmails = async () => {
    try {
      // Convert collaboratorUIDs object to an array of UIDs
      const uidsArray = Object.values(list.collaboratorUIDs || {});
      const emails = await getEmails(uidsArray);
      setCollaboratorEmails(emails);
    } catch (error) {
      console.error('Error fetching collaborator emails:', error);
    }
  };
  
  
/* this gets all UIDS for testing

const getUsers = async () => {
  try {
    const usersSnapshot = await get(ref(database, 'users'));
    const usersData = usersSnapshot.val();
    if (usersData) {
      const uids = Object.values(usersData).map(user => user.UID);
      console.log('List of all UIDs in the users table:', uids);
    } else {
      console.log('No users found in the users table.');
    }
  } catch (error) {
    console.error('Error fetching users from the database:', error);
  }
};
getUsers();

*/







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
      console.log('user:', user);
      if (user) {
        console.log('user passed');
        const listRef = ref(database, `lists/${list.listId}/collaboratorUIDs`);
        try {
          push(listRef, user.UID);
          console.log('pushed: ', user.UID);
          setNewCollaborator(''); // Clear input field after adding
        } catch (error) {
          console.error('Error adding collaborator UID:', error);
        }
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
      <FlatList
        data={collaboratorEmails}
        renderItem={({ item }) => <Text>{item}</Text>}
        keyExtractor={(item, index) => index.toString()}
      />
      <Button title="Add Collaborator" onPress={() => setModalVisible(true)} />
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



