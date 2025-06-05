import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (text) => {
    setQuery(text);
    onSearch(text); // Pass to parent
  };

  return (
    <View style={styles.searchContainer}>
      <FontAwesome name="search" size={20} color="#999" style={styles.icon} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search recipes..."
        placeholderTextColor="#999"
        value={query}
        onChangeText={handleSearch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#333',
    borderRadius: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    height: 40,
    marginTop: 140,
  },
  icon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
    height: '100%',
    paddingVertical: 0,
  },
});

export default SearchBar;
