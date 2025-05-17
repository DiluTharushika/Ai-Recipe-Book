import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#b35900', // Brown for selected icon
        tabBarInactiveTintColor: '#666666', // White for unselected icons
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tabs.Screen
        name='home'
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome5 name="home" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name='favourite'
        options={{
          title: 'Favourite',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome name="heart" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name='add'
        options={{
          title: 'Add',
          headerShown: false,
          tabBarButton: (props) => (
            <TouchableOpacity {...props} style={styles.addButton}>
              <FontAwesome name="plus" size={30} color="#ffffff" />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome name="user" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name='menu'
        options={{
          title: 'Menu',
          headerShown: false,
          tabBarIcon: ({ color }) => <Feather name="menu" size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    position: 'absolute',
    height: 55,
    shadowColor: "#FF8C42",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 2.1,
    shadowRadius: 8,
    elevation: 8,
    paddingBottom: 10,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  tabBarItem: {
    marginVertical: 0,
  },
  addButton: {
    width: 60,
    height: 60,
    backgroundColor: '#b35900',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 1,
    left: '50%',
    marginLeft: -30,
    shadowColor: '#331a00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 12,
  }
});
