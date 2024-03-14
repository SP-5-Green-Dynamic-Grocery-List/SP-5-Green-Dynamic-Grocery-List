import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { ref, onValue, off, query, equalTo } from 'firebase/database';
import { useRoute } from '@react-navigation/native';
import { auth, database } from './config/firebase';
import { useContext } from '@react-navigation/native';
import fetchProductData from './index';


const axios = require('axios');

const db = database; // Firebase Realtime Database instance

const ListScreen = ({ navigation }) => {
  const [lists, setLists] = useState([]);
  const route = useRoute();
  const user = route.params.user

  


  console.log('this is uid in list: ');
  console.log(user.uid);

  
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await fetchProductData('orange', '30114');
        console.log('Fetched products:', products);
        // Further processing of fetched products
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchData();






    
    const listsRef = ref(db, 'lists');
  
    const handleData = (snapshot) => {
      const listsData = snapshot.val();
      if (listsData) {
        // Iterate over each list
        const listsArray = Object.entries(listsData).map(([listId, list]) => ({
          ...list,
          listId: listId // Include the listId in the list object
        }));
  
        // Filter lists based on creatorUID
        const userLists = listsArray.filter(list => list.creatorUID === user.uid);
        setLists(userLists);
      } else {
        setLists([]);
      }
    };
  
    onValue(listsRef, handleData);
  
    // Cleanup function to detach the listener when component unmounts
    return () => {
      // Detach the listener
      off(listsRef, handleData);
    };
  }, [user]);
  

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
            {/* You can display additional list information here */}
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.listID}
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

