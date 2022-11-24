import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import AppContext from '../AppContext';
import SearchBarComponent from '../Components/SearchBarComponent';
import 'react-native-get-random-values';
import {nanoid} from 'nanoid';
import firestore from '@react-native-firebase/firestore';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

import {Appbar, Avatar, Button, TextInput, Chip} from 'react-native-paper';
import UserCardAddGroup from '../Components/UserCardAddGroup';

export default function Search({navigation}) {
  const [searchKey, setSearchKey] = useState('');
  const {user} = React.useContext(AppContext);
  const [image, setImage] = useState(null);
  const [nameGroup, setNameGroup] = useState('');
  const [allUsers, setAllUsers] = React.useState(null);
  const [check2, setCheck2] = useState(false);
  const [userAddArr, setUserAddArr] = useState([]);

  const docid = nanoid();
  React.useEffect(() => {
    const focusHandler = navigation.addListener('focus', () => {});
    return focusHandler;
  }, []);
  const getAllUsers = async () => {
    const querySanp = await firestore()
      .collection('users')
      .where('uid', '!=', user.uid)
      .get();
    const result = querySanp.docs.map(docSnap => docSnap.data());

    setAllUsers(result);
  };

  React.useEffect(() => {
    getAllUsers();
  }, []);

  const getEmailArray = arr => {
    const list = arr.map(item => item.email);
    return list;
  };
  const getAllFieldsArray = arr => {
    const list = arr.map(item => item);
    return list;
  };

  const pickImageAndUpload = async () => {
    const fileResult = await launchImageLibrary({
      quality: 0.5,
      includeBase64: true,
    });
    if (fileResult.assets.length) {
      const fileObj = fileResult.assets[0];
      const uploadTask = storage()
        .ref()
        .child(`/imageChatRooms/photoGroup.png`)
        .putString(fileObj.base64, 'base64');

      uploadTask.on(
        'state_changed',
        snapshot => {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (progress === 100) {
            alert('image uploaded');
          }
        },
        error => {
          alert('error uploading image');
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            setImage(downloadURL);
          });
        },
      );
    }
  };

  const onPressAddGroup = async () => {
    const currenUserData = await firestore()
      .collection('users')
      .doc(user.uid)
      .get();
    console.log(currenUserData);
    firestore()
      .collection('conversations')
      .doc(docid)
      .set({
        infoGroup: {
          groupName: nameGroup,
          photoURL: image,
        },
        lastMessage: [],
        participantArray: [
          ...getEmailArray(userAddArr),
          currenUserData.data().email,
        ],
        participants: [...userAddArr, currenUserData.data()],
      })
      .then(() => {
        console.log('group added!');
      });

    navigation.navigate('ChatGroup', {
      chatWith: {groupName: nameGroup, photoURL: image},
      room: {id: docid},
    });
  };
  const onPress = item => {
    userAddArr.push(item);
    setCheck2(!check2);

    console.log(getAllFieldsArray(userAddArr));
    console.log(getEmailArray(userAddArr));
  };
  const onDelete = item => {
    setUserAddArr(userAddArr.filter(a => a.uid !== item.uid));
  };

  return (
    <>
      <Appbar.Header style={{backgroundColor: '#0068FF'}}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Tạo Nhóm Mới " />
      </Appbar.Header>
      <View style={styles.container}>
        <View style={styles.infoGroup}>
          <TouchableOpacity onPress={pickImageAndUpload}>
            {!image ? (
              <Avatar.Icon
                style={{marginRight: 10, backgroundColor: '#0068FF'}}
                size={35}
                icon="camera-plus"
              />
            ) : (
              <Image
                source={{uri: image}}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  marginRight: 10,
                }}
              />
            )}
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            label="Tên Nhóm (Bắt buộc)"
            placeholder="Nhập tên nhóm"
            mode="outlined"
            onChangeText={setNameGroup}
          />
          <Button mode="text" color="blue" onPress={() => onPressAddGroup()}>
            tao nhom
          </Button>
        </View>
        <View style={{}}>
          <SearchBarComponent
            search={searchKey}
            setSearch={setSearchKey}
            keyPress={{}}
          />
        </View>

        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          {userAddArr.map(userTick => (
            <Chip
              style={{backgroundColor: '#ffff', margin: 5}}
              onClose={() => onDelete(userTick)}
              key={userTick.uid}
              closeIcon="close"
              onPress={() => onDelete(userTick)}>
              <Text key={userTick.uid}>{userTick.displayName}</Text>
            </Chip>
          ))}
        </View>

        <View style={styles.list}>
          <Text>Gợi ý</Text>

          <FlatList
            data={allUsers}
            extraData={allUsers}
            renderItem={({item}) => {
              return (
                <UserCardAddGroup
                  chatWith={item}
                  onPress={() => onPress(item)}
                  onDelete={() => onDelete(item)}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  list: {marginTop: 20, flex: 1},
  infoGroup: {
    alignItems: 'center',

    justifyContent: 'center',
    flexDirection: 'row',
    height: 70,
    borderBottomWidth: 1,
  },
  input: {
    width: 230,
    borderRadius: 10,
    height: 40,
    backgroundColor: '#ffff',
  },
});
