import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const GlobalContext = React.createContext({
  rooms: [],
  setRooms: () => {},
  unFilteredRooms: [],
  setUnFilteredRooms: () => {},
});

export default GlobalContext;
