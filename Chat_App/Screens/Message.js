import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IonsIcon from 'react-native-vector-icons/Ionicons';
import React, {useContext} from 'react';
import {Appbar, Avatar, IconButton} from 'react-native-paper';
import MessageCard from './MessageCard';
import GlobalContext from '../context/Context';
import firestore from '@react-native-firebase/firestore';
import AppContext from '../AppContext';

export default function Message({navigation}) {
  const {user} = React.useContext(AppContext);
  const {rooms, setRooms, setUnfilteredRooms} = useContext(AppContext);
  const [users, setUsers] = React.useState(null);

  const getUsers = async () => {
    const querySanp = await firestore()
      .collection('users')
      .where('uid', '!=', user.uid)
      .get();
    const allusers = querySanp.docs.map(docSnap => docSnap.data());

    setUsers(allusers);
  };

  const getChat = async () => {
    const chatsQuery = await firestore()
      .collection('chatrooms')
      .where('participantArray', 'array-contains', user.email)
      .get();
    const parsedChats = chatsQuery.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      chatWith: doc.data().participants.find(p => p.email !== user.email),
    }));
    setUnfilteredRooms(parsedChats);

    setRooms(parsedChats.filter(doc => doc.lastMessage));
    console.log(parsedChats);
    console.log('roomms', rooms);
    console.log('chatWith', rooms[0].chatWith);
  };

  React.useEffect(() => {
    getChat();
  }, []);

  const pressChat = item => {
    navigation.navigate('Chat', {
      chatWith: item,
    });
  };
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
          data={rooms}
          renderItem={({room}) => {
            return (
              <MessageCard
                // chatWith={room.chatWith}
                description={room.lastMessage.text}
              />
            );
          }}
          keyExtractor={room => room.id}
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
