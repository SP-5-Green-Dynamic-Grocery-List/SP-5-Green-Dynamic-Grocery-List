// ItemDiscovery.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, Image, StyleSheet } from 'react-native';

// Example items
const items = [
  {
    id: 1,
    name: 'Natures Own Honey Wheat Bread',
    description: 'super awesome bread',
    price: '$100.00',
    image: require('./assets/items/bread.png'),
  },
  {
    id: 2,
    name: 'Fairlife Milk',
    description: 'Description for Item 2',
    price: '$20.00',
    image: require('./assets/items/fairlife.jpg'),
  },
];

function ItemDiscovery() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const handleSearch = () => {
    // Simple search by name for demonstration
    const foundItem = items.find(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    setSelectedItem(foundItem);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search items..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="Search" onPress={handleSearch} />
      {selectedItem && (
        <View style={styles.itemDetails}>
          <Image source={selectedItem.image} style={styles.itemImage} />
          <Text style={styles.itemText}>Name: {selectedItem.name}</Text>
          <Text style={styles.itemText}>Description: {selectedItem.description}</Text>
          <Text style={styles.itemText}>Price: {selectedItem.price}</Text>
        </View>
      )}
      <Button title="Add to List" onPress={() => navigation.navigate('List Details', { selectedItem })}
/>

    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
  },
  itemDetails: {
    alignItems: 'center',
    marginTop: 20,
  },
  itemImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  itemText: {
    marginBottom: 5,
  },
});

export default ItemDiscovery;
