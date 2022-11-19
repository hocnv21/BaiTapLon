import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
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

export default function ChatGroup({groupName, navigation}) {
  const {user} = React.useContext(AppContext);
  const [messages, setMessages] = React.useState([]);
  const [allUsers, setAllUsers] = React.useState(null);

  const name = groupName;

  const docid = '1';

  const messageRef = firestore()
    .collection('chatrooms')
    .doc(docid)
    .collection('messages')
    .orderBy('createdAt', 'desc');

  React.useEffect(() => {}, []);

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={name} />
      </Appbar.Header>
      <View style={{flex: 1}}>
        <GiftedChat
          messages={messages}
          user={{
            _id: user.uid,
          }}
          // onSend={text => onSend(text)}
          // renderAvatar={() => (
          //   <Avatar.Image size={36} source={{uri: chatWith.photoURL}} />
          // )}
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
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
