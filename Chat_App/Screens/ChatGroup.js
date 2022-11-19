import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import AppContext from '../AppContext';
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  Actions,
  Send,
} from 'react-native-gifted-chat';
import ImageView from 'react-native-image-viewing';
import {Appbar, Avatar, IconButton} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

export default function ChatGroup({route, navigation}) {
  const {user} = React.useContext(AppContext);
  const [messages, setMessages] = React.useState([]);
  const [allUsers, setAllUsers] = React.useState(null);

  const [currenUser, setCurrenUser] = React.useState('');

  const {chatWith, room} = route.params;

  const docid = room.id;

  const messageRef = firestore()
    .collection('chatrooms')
    .doc(docid)
    .collection('messages')
    .orderBy('createdAt', 'desc');

  useEffect(() => {
    firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(docSnap => {
        setCurrenUser(docSnap.data());
      });
  }, [user]);
  useEffect(() => {
    // getAllMessages()

    const unSubscribe = messageRef.onSnapshot(querySnap => {
      const allmsg = querySnap.docs.map(docSanp => {
        const data = docSanp.data();
        if (data.createdAt) {
          return {
            ...docSanp.data(),
            createdAt: docSanp.data().createdAt.toDate(),
          };
        } else {
          return {
            ...docSanp.data(),
            createdAt: new Date(),
          };
        }
      });
      setMessages(allmsg);
    });

    return () => {
      unSubscribe();
    };
  }, [messageRef]);
  function setLastMessage(messageArray, Docid) {
    const lastMessage = messageArray[0];

    firestore()
      .collection('chatrooms')
      .doc(Docid)
      .update({lastMessage: lastMessage});
  }
  const onSend = messageArray => {
    console.log({user});
    const msg = messageArray[0];
    const mymsg = {
      ...msg,
      sentBy: currenUser.uid,

      createdAt: new Date(),
    };
    setMessages(previousMessages => GiftedChat.append(previousMessages, mymsg));

    const payload = {
      ...mymsg,
      createdAt: firestore.FieldValue.serverTimestamp(),
    };

    console.log({payload});
    setLastMessage(messageArray, docid);
    firestore()
      .collection('chatrooms')
      .doc(docid)
      .collection('messages')
      .add(payload);
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={chatWith.groupName} />
      </Appbar.Header>

      <GiftedChat
        messages={messages}
        user={{
          _id: currenUser.uid,
          name: currenUser.displayName,
          avatar: currenUser.photoURL,
        }}
        renderUsernameOnMessage={true}
        onSend={text => onSend(text)}
        renderAvatar={props => (
          <Avatar.Image
            size={36}
            source={{uri: props.currentMessage.user.avatar}}
          />
        )}
        renderActions={props => (
          <Actions
            {...props}
            containerStyle={{
              position: 'absolute',
              right: 70,
              bottom: 3,
              zIndex: 9999,
            }}
            // onPressActionButton={onSendImage}
            icon={() => <Avatar.Icon size={30} icon="camera" />}
          />
        )}
        alwaysShowSend={true}
        renderBubble={props => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: 'green',
                },
              }}
            />
          );
        }}
        renderChatEmpty={() => {
          return (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                transform: [{scaleY: -1}],
              }}>
              <Image
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                }}
                source={{uri: chatWith.photoURL}}
              />
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: 'bold',
                  marginBottom: 30,
                }}>
                {chatWith.groupName}
              </Text>
              <Text style={{}}>
                Bạn và{' '}
                <Text style={{fontWeight: 'bold'}}>{chatWith.groupName}</Text>{' '}
                chưa có cuộc trò chuyện nào
              </Text>
              <Text>
                Hãy gửi đến nhau những lời nói yêu thương nhất đi nào
                {''}
              </Text>
            </View>
          );
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({});
