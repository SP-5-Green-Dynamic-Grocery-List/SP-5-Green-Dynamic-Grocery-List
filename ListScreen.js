// ListScreen.js
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';

const ListScreen = ({ navigation }) => {
  const [lists, setLists] = useState([]);

  const addList = (list) => {
    setLists(currentLists => [...currentLists, { ...list, id: Math.random().toString() }]);
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
