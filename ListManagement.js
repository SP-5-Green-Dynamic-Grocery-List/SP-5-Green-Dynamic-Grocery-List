// ListManagement.js
import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { getDatabase, ref, remove } from 'firebase/database';

const ListManagement = ({ route, navigation }) => {
  const { listId } = route.params; // Assuming you pass the list ID as a parameter

  const db = getDatabase();

  const handleDeleteList = () => {
    const listRef = ref(db, `lists/${listId}`);
    remove(listRef)
      .then(() => {
        Alert.alert('Success', 'List deleted successfully');
        navigation.goBack(); // Assuming you want to go back to the previous screen
      })
      .catch((error) => {
        Alert.alert('Error', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text>List Management</Text>
      <Button title="Add User" onPress={() => {}} /> {/* Implement the Add User functionality */}
      <Button title="Edit List" onPress={() => {}} /> {/* Implement the Edit List functionality */}
      <Button title="Delete List" onPress={handleDeleteList} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});

export default ListManagement;
