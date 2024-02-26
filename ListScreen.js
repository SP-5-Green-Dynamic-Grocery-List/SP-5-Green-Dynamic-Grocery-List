import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView } from 'react-native';


const initialItems = [
  { id: 1, name: '' },
  { id: 2, name: '' },

];

export default function ListScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState(initialItems);

  // Filter items based on search query
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search..."
        value={searchQuery}
        onChangeText={text => setSearchQuery(text)}
      />
      <ScrollView style={styles.scrollView}>
        {filteredItems.map((item, index) => (
          <View key={item.id} style={styles.tableRow}>

          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  searchBar: {
    marginHorizontal: 10,
    marginBottom: 10,
    paddingHorizontal: 8,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
  scrollView: {
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  cell: {
    flex: 1,
  },
});