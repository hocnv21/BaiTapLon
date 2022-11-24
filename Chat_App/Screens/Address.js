import {StyleSheet, Text, View, TouchableOpacity, FlatList} from 'react-native';
import React, {useContext, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IonsIcon from 'react-native-vector-icons/Ionicons';
import AppContext from '../AppContext';
import SearchBarComponent from '../Components/SearchBarComponent';
import 'react-native-get-random-values';
import {nanoid} from 'nanoid';
import firestore from '@react-native-firebase/firestore';
import GlobalContext from '../context/Context';
import UserCard from '../Components/UserCard';
import {Appbar, Avatar, Button, TextInput} from 'react-native-paper';
import Group from './Group';

function Address({navigation}) {
  const [searchKey, setSearchKey] = useState('');
  const {user} = React.useContext(AppContext);

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
  return (
    <View style={styles.container}>
      <View
        style={{
          width: '100%',
          height: 60,
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          backgroundColor: '#0068FF',
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Search')}
          activeOpacity={1}
          style={{
            flex: 1,
            backgroundColor: '#0068FF',
            height: 40,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <IonsIcon
            activeOpacity={1}
            name="search-outline"
            size={25}
            style={{marginHorizontal: 10, color: '#ffff'}}
          />
          <Text style={{color: '#F8F5F5', fontSize: 16}}>Tìm kiếm</Text>
        </TouchableOpacity>

        <View>
          <MaterialCommunityIcons.Button
            backgroundColor={'#0068FF'}
            size={30}
            name="account-plus-outline"
          />
        </View>
      </View>
      <View style={{marginTop: 100}}>
        <Text>Gợi ý</Text>
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
  );
}

export default Address;
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffff',
  },
  list: {},
});
