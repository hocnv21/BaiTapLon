import React, {useState, useEffect, useLayoutEffect, useCallback} from 'react';
import {TouchableOpacity, Text} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
} from 'firebase/firestore';

import {useNavigation} from '@react-navigation/native';
import {MaterialCommunityIcons} from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Chat({user, route}) {
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => (
  //       <TouchableOpacity
  //         style={{
  //           marginRight: 10,
  //         }}
  //         onPress={onSignOut}>
  //         <MaterialCommunityIcons
  //           name="arrow-left"
  //           size={24}
  //           style={{marginRight: 10}}
  //         />
  //       </TouchableOpacity>
  //     ),
  //   });
  // }, [navigation]);

  // useLayoutEffect(() => {
  //   const collectionRef = collection(db, 'chats');
  //   const q = query(collectionRef, orderBy('createdAt', 'desc'));

  //   const unsubscribe = onSnapshot(q, querySnapshot => {
  //     console.log('querySnapshot unsusbscribe');
  //     setMessages(
  //       querySnapshot.docs.map(doc => ({
  //         _id: doc.data()._id,
  //         createdAt: doc.data().createdAt.toDate(),
  //         text: doc.data().text,
  //         user: doc.data().user,
  //       })),
  //     );
  //   });
  //   return unsubscribe;
  // }, []);

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
    // setMessages([...messages, ...messages]);
    // const {_id, createdAt, text, user} = messages[0];
    // addDoc(collection(db, 'chats'), {
    //   _id,
    //   createdAt,
    //   text,
    //   user,
    // });
  }, []);

  return (
    // <>
    //   {messages.map(message => (
    //     <Text key={message._id}>{message.text}</Text>
    //   ))}
    // </>

    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={false}
      showUserAvatar={false}
      onSend={messages => onSend(messages)}
      messagesContainerStyle={{
        backgroundColor: '#0000',
      }}
      textInputStyle={{
        backgroundColor: '#fff',
        borderRadius: 20,
      }}
      // user={{
      //   _id: auth?.currentUser?.email,
      //   avatar: 'https://i.pravatar.cc/300',
      // }}
    />
  );
}
