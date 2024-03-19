import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';

const ListManagementScreen = ({ route, navigation }) => {
  const [listName, setListName] = useState('');
  const [listDescription, setListDescription] = useState('');

  const handleSaveChanges = () => {
    // Placeholder for save functionality
    Alert.alert('Action Needed', 'Save functionality needs implementation.');
  };

  const handleDeleteList = () => {
    // Placeholder for delete functionality
    Alert.alert('Action Needed', 'Delete functionality needs implementation.');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={listName}
        onChangeText={setListName}
        placeholder="List Name"
      />
      <TextInput
        style={styles.input}
        value={listDescription}
        onChangeText={setListDescription}
        placeholder="List Description"
      />
      <Button title="Save Changes" onPress={handleSaveChanges} />
      <Button title="Delete List" onPress={handleDeleteList} color="#ff4444" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default ListManagementScreen;
