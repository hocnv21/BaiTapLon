import React, {useState} from 'react';
import Context from './Context';

export default function ContextWrapper(props) {
  const [rooms, setRooms] = useState([]);
  const [unFilteredRooms, setUnFilteredRooms] = useState([]);
  return (
    <Context.Provider
      value={{rooms, setRooms, unFilteredRooms, setUnFilteredRooms}}>
      {props.children}
    </Context.Provider>
  );
}
