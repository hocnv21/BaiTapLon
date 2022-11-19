import {StyleSheet, Text, View, FlatList} from 'react-native';
import React, {useState} from 'react';
import AppContext from '../AppContext';
import SearchBarComponent from '../Components/SearchBarComponent';
import 'react-native-get-random-values';
import {nanoid} from 'nanoid';
import firestore from '@react-native-firebase/firestore';

import UserCard from '../Components/UserCard';
import {Appbar, Avatar, Button, TextInput} from 'react-native-paper';

export default function Search({navigation}) {
  const [searchKey, setSearchKey] = useState('');
  const {user} = React.useContext(AppContext);
  const [nameGroup, setNameGroup] = useState('');

  const [allUsers, setAllUsers] = React.useState(null);

  const docid = nanoid();
  const getUsers = async () => {
    const querySanp = await firestore().collection('users').get();
    const result = querySanp.docs.map(docSnap => docSnap.data());
    console.log(result);
    setAllUsers(result);
  };

  React.useEffect(() => {
    getUsers();
  }, []);

  const onPressAddGroup = async () => {
    firestore()
      .collection('chatrooms')
      .doc(docid)
      .set({participants: allUsers})
      .then(() => {
        console.log('group added!');
      });

    navigation.navigate('ChatGroup', {groupName: nameGroup});
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Tao Nhom moi" />
      </Appbar.Header>
      <View style={styles.container}>
        <View style={styles.infoGroup}>
          <Avatar.Icon
            style={{marginHorizontal: 10}}
            size={35}
            icon="camera-plus"
          />

          <TextInput
            style={styles.input}
            label="Nhap ten nhom"
            placeholder="Nhập tên nhóm"
            mode="outlined"
            onChangeText={setNameGroup}
          />
          <Button mode="text" color="blue" onPress={() => onPressAddGroup()}>
            tao nhom
          </Button>
        </View>

        <SearchBarComponent search={searchKey} setSearch={setSearchKey} />

        <View style={styles.list}>
          <FlatList
            data={allUsers}
            renderItem={({item}) => {
              return <UserCard item={item} />;
            }}
            keyExtractor={item => item.uid}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {marginTop: 20},
  infoGroup: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 70,
    borderBottomWidth: 1,
  },
  input: {
    width: 250,
    borderRadius: 10,
    height: 40,
    backgroundColor: '#ffff',
  },
});
