import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList, Image, TouchableOpacity } from 'react-native';
import { ref, onValue, off } from 'firebase/database';
import { database } from './config/firebase'; 

const ListDetailsScreen = ({ route, navigation }) => {
  const { list } = route.params;
  const [items, setItems] = useState([]);

  useEffect(() => {
    const listRef = ref(database, `lists/${list.listId}/items`);
    const onListChange = onValue(listRef, (snapshot) => {
      const data = snapshot.val();
      const itemList = data ? Object.values(data) : [];
      setItems(itemList);
    });

    return () => off(listRef, 'value', onListChange);
  }, [list.listId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{list.listName}</Text>
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
