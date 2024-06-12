// RouteScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { ref, onValue, off, push, get } from 'firebase/database';
import fetchProductData from './index';
import { auth, database } from './config/firebase';

const RouteScreen = ({ route, navigation }) => {
  const { user } = route.params;
  const [lists, setLists] = useState([]);

  useEffect(() => {
    const listsRef = ref(database, 'lists');
    return onValue(listsRef, (snapshot) => {
      const allLists = [];
      snapshot.forEach((childSnapshot) => {
        const list = childSnapshot.val();
        if (list.creatorUID === user.uid) {
          allLists.push({
            ...list,
            key: childSnapshot.key,
          });
        }
      });
      setLists(allLists);
    });
  }, []);

  const handleSelectList = async (list) => {
    const itemsRef = ref(database, `lists/${list.key}/items`);
    const snapshot = await get(itemsRef);
    if (snapshot.exists()) {
      let items = Object.values(snapshot.val());
      // Sort items in descending order based on aisle number
      items.sort((a, b) => parseInt(b.Location[0].number) - parseInt(a.Location[0].number));
      navigation.navigate('Item Detail', { items });
    }
  };
  

  return (
    <View style={styles.container}>
      <FlatList
        data={lists}
        renderItem={({ item }) => (
          <Button title={item.listName} onPress={() => handleSelectList(item)} />
        )}
        keyExtractor={item => item.key}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RouteScreen;
