import {StyleSheet, Text, View, FlatList} from 'react-native';
import React, {useState, useContext} from 'react';
import AppContext from '../AppContext';
import SearchBarComponent from '../Components/SearchBarComponent';
import 'react-native-get-random-values';
import {nanoid} from 'nanoid';
import firestore from '@react-native-firebase/firestore';
import GlobalContext from '../context/Context';
import UserCard from '../Components/UserCard';
import {Appbar, Avatar, Button, TextInput} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Search({navigation}) {
  const [searchKey, setSearchKey] = useState('');
  const {user} = React.useContext(AppContext);
  const [nameGroup, setNameGroup] = useState('');

  const [allUsers, setAllUsers] = React.useState(null);

  const {unFilteredRooms, rooms} = useContext(GlobalContext);

  const docid = nanoid();
  const getUsers = async () => {
    const querySanp = await firestore()
      .collection('users')
      .where('displayName', '==', searchKey)
      .get();
    const result = querySanp.docs.map(docSnap => docSnap.data());
    if (searchKey.length === 0) {
      getAllUsers();
    }
    console.log(result);
    setAllUsers(result);
  };
  const getAllUsers = async () => {
    const querySanp = await firestore()
      .collection('users')
      .where('uid', '!=', user.uid)
      .get();
    const result = querySanp.docs.map(docSnap => docSnap.data());
    // console.log(result);
    setAllUsers(result);
    console.log(unFilteredRooms);
  };

  React.useEffect(() => {
    getAllUsers();
  }, []);

  const onPressAddGroup = async () => {
    firestore()
      .collection('conversations')
      .doc(docid)
      .set({participants: allUsers})
      .then(() => {
        console.log('group added!');
      });
  };

  return (
    <>
      <View style={styles.container}>
        <View
          style={{
            backgroundColor: '#0068FF',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <MaterialCommunityIcons
            name="chevron-left"
            size={35}
            color={'#ffffff'}
            onPress={() => navigation.goBack()}
          />
          <View style={{flex: 1, marginRight: 30}}>
            <SearchBarComponent
              search={searchKey}
              setSearch={setSearchKey}
              keyPress={getUsers}
            />
          </View>
        </View>

        <View style={styles.list}>
          <FlatList
            data={allUsers}
            renderItem={({item}) => {
              return (
                <UserCard
                  chatWith={item}
                  room={unFilteredRooms.find(room =>
                    room.participants.includes(item.uid),
                  )}
                />
              );
            }}
            keyExtractor={item => item.uid}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({list: {marginTop: 30}});
