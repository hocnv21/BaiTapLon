import React from 'react';

const AppContext = React.createContext({
  user: null,
  rooms: [],
  setRooms: () => {},
  unFilteredRooms: [],
  setUnFilteredRooms: () => {},
});

export default AppContext;
