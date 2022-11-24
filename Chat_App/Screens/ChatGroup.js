import {useState, useEffect, useCallback} from 'react';
import * as React from 'react';
import {
  TouchableOpacity as A,
  Text,
  StyleSheet,
  View,
  Image,
  Dimensions,
  Linking,
  Button,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Clipboard from '@react-native-community/clipboard';

import {
  GiftedChat,
  Bubble,
  InputToolbar,
  Actions,
  MessageText,
  Send,
  TypingIndicator,
  Composer,
} from 'react-native-gifted-chat';
import ImageView from 'react-native-image-viewing';
import {Appbar, Avatar, IconButton} from 'react-native-paper';
import Video from 'react-native-video';
import {Icon} from '@rneui/themed';
import firestore from '@react-native-firebase/firestore';
import 'react-native-get-random-values';
import {nanoid} from 'nanoid';
import {launchImageLibrary} from 'react-native-image-picker';
import DocumentPicker, {types} from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import storage from '@react-native-firebase/storage';
import AppContext from '../AppContext';
import {Swipeable} from 'react-native-gesture-handler';

export default function ChatGroup({route, navigation}) {
  const {user} = React.useContext(AppContext);
  const [messages, setMessages] = React.useState([]);
  const [allUsers, setAllUsers] = React.useState(null);
  const [selectedImageView, setSeletedImageView] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const [currenUser, setCurrenUser] = React.useState('');
  const typeDocument = [
    DocumentPicker.types.csv,
    DocumentPicker.types.doc,
    DocumentPicker.types.docx,
    DocumentPicker.types.pdf,
    DocumentPicker.types.plainText,
    DocumentPicker.types.ppt,
    DocumentPicker.types.pptx,
    DocumentPicker.types.xls,
    DocumentPicker.types.xlsx,
    DocumentPicker.types.zip,
  ];
  const [replyMsg, setReplyMsg] = useState({
    replyId: null,
    replyTo: null,
    replyText: '',
  });
  const typeVideo = [DocumentPicker.types.video];

  const {chatWith, room} = route.params;

  const docid = room.id;

  const messageRef = firestore()
    .collection('conversations')
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
      .collection('conversations')
      .doc(Docid)
      .update({lastMessage: lastMessage});
  }
  const onSend = messageArray => {
    console.log({user});
    if (replyMsg.replyId !== null) {
      messageArray[0].replyMessage = {
        replyId: replyMsg.replyId,
        replyText: replyMsg.replyText,
        replyTo: replyMsg.replyTo,
      };
    }
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
      .collection('conversations')
      .doc(docid)
      .collection('messages')
      .add(payload);

    setReplyMsg({replyId: null, replyText: '', replyTo: null});
  };
  const handleDocumentSelection = async type => {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await DocumentPicker.pick({
          type: type,
        });
        // console.log('resulting file: ' + result);
        // console.log('string result? ' + JSON.stringify(result));
        // console.log('Filename at best: ' + result[0].name);
        let fileRef = storage()
          .ref()
          .child(`/fileChatRooms/${docid}/${result[0].name}`);
        let fileUri = result[0].uri;
        const response = await fetch(fileUri);
        const blob = await response.blob();
        await fileRef.put(blob);
        var dwnload = await fileRef.getDownloadURL();
        console.log('Download file: ' + dwnload);
        resolve({
          dwnload,
          fileName: result[0].name,
          fileType: result[0].type,
        });
      } catch (e) {
        if (DocumentPicker.isCancel(e)) {
          console.log('User cancelled!');
        } else {
          reject(e);
        }
      }
    });
  };
  async function onSendFile() {
    const {dwnload, fileName, fileType} = await handleDocumentSelection(
      typeDocument,
    );

    const mymsg = {
      _id: Date.now(),
      sentBy: user.uid,

      fileUri: dwnload,
      fileName: fileName,
      fileType: fileType,
      createdAt: new Date(),
      user: {
        _id: user.uid,
        name: currenUser.displayName,
      },
    };

    const payload = {
      ...mymsg,
      createdAt: firestore.FieldValue.serverTimestamp(),
    };
    console.log({payload});
    firestore()
      .collection('conversations')
      .doc(docid)
      .collection('messages')
      .add(payload);
  }
  async function onSendVideo() {
    const {dwnload, fileName, fileType} = await handleDocumentSelection(
      typeVideo,
    );

    const mymsg = {
      _id: Date.now(),
      sentBy: user.uid,

      video: dwnload,
      fileName: fileName,
      fileType: fileType,
      createdAt: new Date(),
      user: {
        _id: user.uid,
        name: currenUser.displayName,
      },
    };

    const payload = {
      ...mymsg,
      createdAt: firestore.FieldValue.serverTimestamp(),
    };
    console.log({payload});
    firestore()
      .collection('conversations')
      .doc(docid)
      .collection('messages')
      .add(payload);
  }

  const pickImageAndUpload = async () => {
    return new Promise(async (resolve, reject) => {
      const fileResult = await launchImageLibrary({
        quality: 0.5,
        includeBase64: true,
      });
      if (fileResult.assets.length) {
        const fileObj = fileResult.assets[0];
        const uploadTask = storage()
          .ref()
          .child(`/imageChatRooms/${docid}/${Date.now()}.png`)
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
            reject(error);
          },
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
              resolve({
                downloadURL,
                fileName: fileObj.fileName,
              });
            });
          },
        );
      }
    });
  };

  function setLastMessage(messageArray, Docid) {
    const lastMessage = messageArray[0];

    firestore()
      .collection('conversations')
      .doc(Docid)
      .update({lastMessage: lastMessage});
  }

  async function onSendImage() {
    const {downloadURL, fileName} = await pickImageAndUpload();

    const mymsg = {
      _id: Date.now(),
      sentBy: user.uid,

      image: downloadURL,
      createdAt: new Date(),
      user: {
        _id: user.uid,
        name: currenUser.displayName,
      },
    };

    const payload = {
      ...mymsg,
      createdAt: firestore.FieldValue.serverTimestamp(),
    };
    console.log({payload});
    firestore()
      .collection('coversations')
      .doc(docid)
      .collection('messages')
      .add(payload);
  }

  function renderSend(props) {
    return (
      <Send {...props}>
        <View style={styles.sendingContainer}>
          <IconButton icon="send" size={32} color="#6646ee" />
        </View>
      </Send>
    );
  }
  function renderMessageImage(props) {
    return (
      <View style={{borderRadius: 15, padding: 2}}>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
            setSeletedImageView(props.currentMessage.image);
          }}>
          <Image
            resizeMode="contain"
            style={{
              width: 200,
              height: 200,
              padding: 6,
              borderRadius: 15,
              resizeMode: 'cover',
            }}
            source={{uri: props.currentMessage.image}}
          />
          {selectedImageView ? (
            <ImageView
              imageIndex={0}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
              images={[{uri: selectedImageView}]}
            />
          ) : null}
        </TouchableOpacity>
      </View>
    );
  }
  function scrollToBottomComponent() {
    return (
      <View style={styles.bottomComponentContainer}>
        <IconButton icon="chevron-double-down" size={36} color="#6646ee" />
      </View>
    );
  }

  const Reply = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
        }}>
        <View style={{width: 5, backgroundColor: 'red'}}></View>
        <View style={{flex: 1, flexDirection: 'column'}}>
          <Text
            style={{
              color: 'red',
              paddingLeft: 10,
              paddingTop: 5,
              fontWeight: 'bold',
            }}>
            {replyMsg?.replyTo}
          </Text>
          <Text
            style={{
              color: '#034f84',
              paddingLeft: 10,
              paddingTop: 5,
              marginBottom: 2,
            }}>
            {replyMsg.replyText}
          </Text>
        </View>
        <TouchableOpacity
          style={{padding: 20}}
          onPress={() =>
            setReplyMsg({replyId: null, replyText: '', replyTo: null})
          }>
          <Icon name="x" type="feather" color="#0084ff" size={20} />
        </TouchableOpacity>
      </View>
    );
  };

  function onReplyMessage(pressed_message) {
    setReplyMsg({
      replyId: pressed_message._id,
      replyTo: pressed_message.user.name,
      replyText: pressed_message.text,
    });

    console.log(replyMsg);
  }
  function onDeleteMessage(pressed_message) {
    setMessages(messages.filter(x => x._id !== pressed_message._id));
  }

  const onLongPress = (context, pressed_message) => {
    if (pressed_message.text !== '') {
      console.log(context, pressed_message);
      const options = ['Sao chép', 'Phản hồi', 'Thu hồi', 'cancel'];
      const cancelButtonIndex = options.length;
      context
        .actionSheet()
        .showActionSheetWithOptions(
          {options, cancelButtonIndex},
          buttonIndex => {
            switch (buttonIndex) {
              case 0:
                Clipboard.setString(pressed_message.text);
                break;
              case 1:
                onReplyMessage(pressed_message);
                break;
              case 2:
                onDeleteMessage(pressed_message);
                break;
            }
          },
        );
    }
  };

  return (
    <>
      <Appbar.Header style={{backgroundColor: '#0068FF'}}>
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
        renderSend={renderSend}
        renderInputToolbar={props => {
          return (
            <>
              <InputToolbar
                {...props}
                containerStyle={{
                  borderTopWidth: 1,
                  borderTopColor: '#0068FF',
                }}
                textInputStyle={{color: 'black', marginRight: 40}}
              />
            </>
          );
        }}
        renderActions={props => {
          return (
            <>
              <Actions
                {...props}
                // containerStyle={{
                //   position: 'absolute',
                //   right: 60,
                //   bottom: 3,
                //   zIndex: 9999,
                // }}
                onPressActionButton={onSendImage}
                icon={() => <Avatar.Icon size={30} icon="image" />}
              />
              <Actions
                {...props}
                icon={() => <Avatar.Icon size={30} icon="paperclip" />}
                onPressActionButton={onSendFile}
              />
              <Actions
                {...props}
                icon={() => <Avatar.Icon size={30} icon="camera" />}
                onPressActionButton={onSendVideo}
              />
            </>
          );
        }}
        renderUsernameOnMessage={true}
        onSend={text => onSend(text)}
        renderAvatar={props => (
          <Avatar.Image
            size={36}
            source={{uri: props.currentMessage.user.avatar}}
          />
        )}
        onLongPress={onLongPress}
        renderFooter={props => {
          if (replyMsg.replyId !== null) return Reply();
        }}
        alwaysShowSend={true}
        renderBubble={props => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: '#0068FF',
                },
                left: {
                  backgroundColor: '#E4E6EB',
                },
              }}
              textStyle={{
                left: {
                  color: '#000000',
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
        renderCustomView={props => {
          if (props?.currentMessage?.fileUri) {
            return (
              <View
                style={{
                  margin: 5,
                  borderRadius: 10,
                }}>
                <TouchableOpacity
                  onPress={() => Linking.openURL(props.currentMessage.fileUri)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View>
                    <IconButton
                      icon="file-document"
                      size={32}
                      color="#949391"
                    />
                  </View>
                  <View style={{}}>
                    <Text style={styles.textFile}>
                      {props.currentMessage.fileName}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }
          if (props?.currentMessage?.replyMessage?.replyId) {
            return (
              <>
                <View style={{padding: 5}}>
                  <View style={{backgroundColor: '#005CB5', borderRadius: 15}}>
                    <View style={{flexDirection: 'row'}}>
                      <View
                        style={{
                          height: '100%',
                          width: 10,
                          backgroundColor: '#00468A',
                          borderTopLeftRadius: 15,
                          borderBottomLeftRadius: 15,
                        }}
                      />
                      <View style={{flexDirection: 'column'}}>
                        <Text style={styles.textReplyTo}>
                          {props.currentMessage?.replyMessage?.replyTo}
                        </Text>
                        <Text style={styles.textReply}>
                          {props.currentMessage?.replyMessage?.replyText}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </>
            );
          }
        }}
        renderMessageImage={renderMessageImage}
        renderMessageVideo={props => {
          return (
            <View style={{borderRadius: 15, padding: 2}}>
              <TouchableOpacity
                activeOpacity={1}
                // onPress={() => {
                //   setModalVisible(true);
                //   setSeletedImageView(props.currentMessage.video);
                // }}
              >
                <Video
                  paused={false}
                  repeat={false}
                  controls={true}
                  resizeMode="cover"
                  style={{
                    width: Dimensions.get('window').width / 1.4,
                    height: Dimensions.get('window').width / 1.4,
                    padding: 6,
                    borderRadius: 15,
                  }}
                  source={{uri: props.currentMessage.video}}
                />
                {/* {selectedImageView ? (
                    <Video
                      paused={false}
                      repeat={false}
                      controls={true}
                      resizeMode="cover"
                      style={{
                        width: Dimensions.get('window').width / 1.4,
                        height: Dimensions.get('window').width / 1.4,
                        padding: 6,
                        borderRadius: 15,
                      }}
                      source={{uri: selectedImageView}}
                    />
                  ) : null} */}
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomComponentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textFile: {
    fontWeight: 'bold',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
  textReplyTo: {
    color: 'white',
    paddingHorizontal: 10,
    paddingTop: 5,
    fontWeight: '700',
  },
  textReply: {
    color: 'white',
    paddingHorizontal: 10,
    paddingTop: 5,
    marginBottom: 5,
  },
});
