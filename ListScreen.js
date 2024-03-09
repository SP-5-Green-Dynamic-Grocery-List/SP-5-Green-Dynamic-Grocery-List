import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import { useRoute } from '@react-navigation/native';
import { auth, database } from './config/firebase';


const db = database; // Firebase Realtime Database instance

const ListScreen = ({ navigation }) => {
  const [lists, setLists] = useState([]);
  const route = useRoute();
  const { user } = route.params;

  useEffect(() => {
    // Reference to the "lists" node in the Realtime Database
    const listsRef = ref(db, 'lists');

    // Listen for changes in the data
    onValue(listsRef, (snapshot) => {
      const listsData = snapshot.val();
      if (listsData) {
        // Convert the object of lists to an array
        const listsArray = Object.keys(listsData).map((key) => ({
          id: key,
          ...listsData[key],
        }));
        setLists(listsArray);
      } else {
        setLists([]);
      }
    });

    // Cleanup function to detach the listener when component unmounts
    return () => {
      // Detach the listener
      off(listsRef);
    };
  }, []); // Dependency array is empty to run effect only once

  return (
    <View style={styles.container}>
      <FlatList
        data={lists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => navigation.navigate('List Details', { list: item })}
          >
            <Text style={styles.listItemText}>{item.listName}</Text>
            {/* You can display additional list information here */}
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
