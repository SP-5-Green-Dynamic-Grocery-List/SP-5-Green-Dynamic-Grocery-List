// ListScreen.js
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import { auth, database } from './config/firebase';
import { getDatabase, ref, get } from 'firebase/database';
import { useRoute } from '@react-navigation/native';

const db = getDatabase();


const ListScreen = ({ navigation }) => {
  const [lists, setLists] = useState([]);
  const route = useRoute();
  const { user } = route.params;

  const addList = (list) => {
    // Assume db is your Firebase database reference
    let userUID = "DnXGdd2JHJXmBT6HxcKGlOTtegE3"; // Example user UID
    let newListData = {
      listName: "newListName",
      creatorUID: userUID,
      collaboratorUIDs: {},
      listItemIDs: {}
    };

    // Push the new list data to the "lists" node
    let newListRef = db.ref("lists").push();
    newListRef.set(newListData); // Firebase will generate unique ID for this list






  };

  return (
    <View style={styles.container}>
      <Button title="Add List" onPress={() => navigation.navigate('Add List', { addList })} />
      <FlatList
        data={lists}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('List Details', { list: item })}>
            <Text style={styles.listItemText}>{item.name}</Text>
            <Text>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
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
});

export default ListScreen;
