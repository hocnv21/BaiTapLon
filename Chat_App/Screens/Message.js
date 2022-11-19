import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  RefreshControl,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IonsIcon from 'react-native-vector-icons/Ionicons';
import React, {useContext} from 'react';
import {Appbar, Avatar, IconButton} from 'react-native-paper';
import MessageCard from './MessageCard';
import GlobalContext from '../context/Context';
import firestore from '@react-native-firebase/firestore';
import AppContext from '../AppContext';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

export default function Message({navigation}) {
  const {user} = React.useContext(AppContext);
  const {rooms, setRooms, setUnfilteredRooms} = useContext(AppContext);
  const [users, setUsers] = React.useState(null);

  const [refreshing, setRefreshing] = React.useState(false);

  const getChat = async () => {
    const chatsQuery = await firestore()
      .collection('chatrooms')
      .where('participantArray', 'array-contains', user.email)
      .get();

    const parsedChats = chatsQuery.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      chatWith: doc.data().infoGroup
        ? doc.data().infoGroup
        : doc.data().participants.find(p => p.email !== user.email),
    }));

    // console.log(parsedChats);
    setUnfilteredRooms(parsedChats);
    setRooms(parsedChats.filter(doc => doc.lastMessage));
  };

  React.useEffect(() => {
    const focusHandler = navigation.addListener('focus', () => {
      getChat();
    });
    return focusHandler;
  }, []);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getChat();
    wait(2000).then(() => {
      setRefreshing(false);
    });
  }, []);

  const getUsers = async () => {
    const querySanp = await firestore()
      .collection('users')
      .where('uid', '!=', user.uid)
      .get();
    const allusers = querySanp.docs.map(docSnap => docSnap.data());

    setUsers(allusers);
  };

  React.useEffect(() => {
    getChat();
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
            onPress={() => navigation.navigate('AddGroup')}
            backgroundColor={'#0068FF'}
            size={35}
            name="account-multiple-plus"
          />
        </View>
      </View>

      <View>
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={rooms}
          renderItem={({item}) => {
            return (
              <MessageCard
                key={item.id}
                room={item}
                time={item.lastMessage.createdAt}
                chatWith={item.chatWith}
                description={
                  item.lastMessage.text
                    ? item.lastMessage.text
                    : item.lastMessage.image
                    ? 'image'
                    : item.lastMessage.video
                    ? 'video'
                    : item.lastMessage.fileUri
                    ? 'file'
                    : ''
                }
              />
            );
          }}
          keyExtractor={item => item.id}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffff',
  },
});
