// ItemDetailScreen.js
import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';

const ItemDetailScreen = ({ route }) => {
  const { items } = route.params;
  const [index, setIndex] = useState(0);

  const handleNextItem = () => {
    if (index < items.length - 1) {
      setIndex(index + 1);
    } else {
      // Maybe loop back to the first or show a completion message
      console.log('End of list');
    }
  };

  const item = items[index];

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.frontImage }} style={styles.image} />
      <Text style={styles.text}>{item.name}</Text>
      <Text style={styles.text}>Price: ${item.price}</Text>
      <Text style={styles.text}>Location: {item.Location[0].description}</Text>
      <Button title="Next" onPress={handleNextItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default ItemDetailScreen;
