// ListDetailsScreen
import React from 'react';
import { View, Text, StyleSheet, Button, FlatList, Image, TouchableOpacity} from 'react-native';

const ListDetailsScreen = ({ route, navigation }) => {
  const { list } = route.params;

const { selectedItem } = route.params ?? {};

const [items, setItems] = React.useState(list.items || []);

React.useLayoutEffect(() => {
  navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity
        onPress={() => navigation.navigate('List Management', { listId: list.id })} // Pass the list ID or any other relevant data
        style={{ padding: 10 }}
      >
        <Image
          source={require('./assets/icons/setting.png')}
          style={{ width: 24, height: 24 }}
        />
      </TouchableOpacity>
    ),
  });
}, [navigation]);

  React.useEffect(() => {
    if (selectedItem) {
      // Check if the item is not already in the list
      const itemExists = items.some(item => item.id === selectedItem.id);
      if (!itemExists) {
        setItems(currentItems => [...currentItems, selectedItem]);
      }
    }
  }, [selectedItem]);
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{list.name}</Text>
      <Text style={styles.description}>{list.description}</Text>
      <FlatList
        data={items}
        keyExtractor={item => item.id.toString()}
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
