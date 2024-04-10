// ListDetailsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList, Image, TouchableOpacity } from 'react-native';
import { ref, onValue, off } from 'firebase/database';
import { database } from './config/firebase'; 

const ListDetailsScreen = ({ route, navigation }) => {
  const { list } = route.params;
  const [items, setItems] = useState([]);
  const [collaborators, setCollaborators] = useState([]);

  useEffect(() => {
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

  return (
    <View style={styles.container}>
      <Text>Description: {list.description}</Text>
      <Text style={styles.title}>List Name: {list.listName}</Text>
      <Text>Collaborators:</Text>
      <View>
      {Object.values(list.collaboratorUIDs).map((collaborator, index) => (
        <Text key={index}>{collaborator}</Text>
      ))}
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
});

export default ListDetailsScreen;


