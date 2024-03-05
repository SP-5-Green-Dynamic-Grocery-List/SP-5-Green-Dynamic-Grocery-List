// CreateListScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const CreateListScreen = ({ route, navigation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const { addList } = route.params;

  const handleSaveList = () => {
    addList({ name, description });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="List Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <Button title="Save List" onPress={handleSaveList} />
      <Button title="Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
  },
});

export default CreateListScreen;
