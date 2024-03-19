// ListDetailsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList, Image, TouchableOpacity } from 'react-native';
import { ref, onValue, off } from 'firebase/database';
import { database } from './config/firebase'; // Assuming you have this export

const ListDetailsScreen = ({ route, navigation }) => {
  const { list } = route.params;
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Assuming `list.id` is the correct reference to your list in Firebase
    const listRef = ref(database, `lists/${list.Name}/items`);
    const onListChange = onValue(listRef, (snapshot) => {
      const data = snapshot.val();
      const itemList = data ? Object.entries(data).map(([key, value]) => ({ id: key, ...value })) : [];
      setItems(itemList);
    });

    return () => off(listRef, 'value', onListChange);
  }, [list.id]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{list.name}</Text>
      <Text style={styles.description}>{list.description || 'No description'}</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.name}</Text>
          </View>
        )}
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
    marginTop: 70, 
  },
  description: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  itemContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  itemText: {
    fontSize: 18,
  },
});

export default ListDetailsScreen;
