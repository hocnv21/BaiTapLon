import {useState, useEffect, useCallback} from 'react';
import * as React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Image,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  Actions,
  Send,
} from 'react-native-gifted-chat';
import ImageView from 'react-native-image-viewing';
import {Appbar, Avatar, IconButton} from 'react-native-paper';

import {Icon} from '@rneui/themed';
import firestore from '@react-native-firebase/firestore';
import 'react-native-get-random-values';
import {nanoid} from 'nanoid';
import {launchImageLibrary} from 'react-native-image-picker';
import DocumentPicker, {types} from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import storage from '@react-native-firebase/storage';
import AppContext from '../AppContext';

export default function Chat({route, navigation}) {
  const {user} = React.useContext(AppContext);

  const {chatWith, room} = route.params;
  const {uid} = chatWith;

  const [messages, setMessages] = useState([]);
  const [selectedImageView, setSeletedImageView] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const [fileResponse, setFileResponse] = useState([]);

  const docid = uid > user.uid ? user.uid + '-' + uid : uid + '-' + user.uid;

  const messageRef = firestore()
    .collection('chatrooms')
    .doc(docid)
    .collection('messages')
    .orderBy('createdAt', 'desc');

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
  }, [messageRef, uid]);
  useEffect(() => {
    (async () => {
      if (!room) {
        const currenUserData = await firestore()
          .collection('users')
          .doc(user.uid)
          .get();

        try {
          await firestore()
            .collection('chatrooms')
            .doc(docid)
            .set({
              lastMessage: messages.length === 0 ? [] : messages[0],
              participants: [currenUserData.data(), chatWith],
              participantArray: [currenUserData.data().email, chatWith.email],
            });
          console.log('mess', messages[0]);
          console.log('currenUser', currenUserData.data().email);
          console.log('chatwith', chatWith.email);
        } catch (error) {
          console.log('mess', messages.length);
          console.log('currenUser', currenUserData.data().email);
          console.log('chatwith', chatWith.email);
          console.log('loi tao field ', error);
        }
      }
    })();
  }, []);

  const checkPermission = async ({fileUri}) => {
    // Function to check the platform
    // If iOS then start downloading
    // If Android then ask for permission

    if (Platform.OS === 'ios') {
      downloadImage(fileUri);
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'App needs access to your storage to download Photos',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Once user grant the permission start downloading
          console.log('Storage Permission Granted.');
          downloadImage(fileUri);
        } else {
          // If permission denied then show alert
          alert('Storage Permission Not Granted');
        }
      } catch (err) {
        // To handle permission related exception
        console.warn(err);
      }
    }
  };

  const downloadImage = fileUri => {
    // Main function to download the image

    // To add the time suffix in filename
    let date = new Date();
    // Image URL which we want to download
    let image_URL = fileUri;
    // Getting the extention of the file
    let ext = getExtention(image_URL);
    ext = '.' + ext[0];
    // Get config and fs from RNFetchBlob
    // config: To pass the downloading related options
    // fs: Directory path where we want our image to download
    const {config, fs} = RNFetchBlob;
    let PictureDir = fs.dirs.DownloadDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        // Related to the Android only
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          '/image_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          ext,
        description: 'Image',
      },
    };
    config(options)
      .fetch('GET', image_URL)
      .then(res => {
        // Showing alert after successful downloading
        console.log('res -> ', JSON.stringify(res));
        alert('Image Downloaded Successfully.');
      });
  };

  const getExtention = filename => {
    // To get the file extension
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };

  const handleDocumentSelection = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await DocumentPicker.pick({
          type: [DocumentPicker.types.allFiles],
        });

        console.log('resulting file: ' + result);
        console.log('string result? ' + JSON.stringify(result));
        console.log('Filename at best: ' + result[0].name);

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

        global.pdfFile = dwnload;
        console.log('pdf file: ' + JSON.stringify(global.pdfFile));
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
    const {dwnload, fileName, fileType} = await handleDocumentSelection();

    const mymsg = {
      _id: Date.now(),
      sentBy: user.uid,
      sentTo: uid,
      fileUri: dwnload,
      fileName: fileName,
      fileType: fileType,
      createdAt: new Date(),
      user: {
        _id: user.uid,
      },
    };

    const payload = {
      ...mymsg,
      createdAt: firestore.FieldValue.serverTimestamp(),
      text: '',
    };
    console.log({payload});
    firestore()
      .collection('chatrooms')
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

  const onSend = messageArray => {
    console.log({user});
    const msg = messageArray[0];
    const mymsg = {
      ...msg,
      sentBy: user.uid,
      sentTo: uid,
      createdAt: new Date(),
    };
    setMessages(previousMessages => GiftedChat.append(previousMessages, mymsg));

    const payload = {
      ...mymsg,
      createdAt: firestore.FieldValue.serverTimestamp(),
    };
    const lastMessage = messageArray[0];
    console.log({payload});
    firestore()
      .collection('chatrooms')
      .doc(docid)
      .update({lastMessage: lastMessage});

    firestore()
      .collection('chatrooms')
      .doc(docid)
      .collection('messages')
      .add(payload);
  };

  async function onSendImage() {
    const {downloadURL, fileName} = await pickImageAndUpload();

    const mymsg = {
      _id: Date.now(),
      sentBy: user.uid,
      sentTo: uid,
      image: downloadURL,
      createdAt: new Date(),
      user: {
        _id: user.uid,
      },
    };

    const payload = {
      ...mymsg,
      createdAt: firestore.FieldValue.serverTimestamp(),
      text: '',
    };
    console.log({payload});
    firestore()
      .collection('chatrooms')
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
  function scrollToBottomComponent() {
    return (
      <View style={styles.bottomComponentContainer}>
        <IconButton icon="chevron-double-down" size={36} color="#6646ee" />
      </View>
    );
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={chatWith.displayName} />
      </Appbar.Header>
      <View style={{flex: 1}}>
        <GiftedChat
          messages={messages}
          scrollToBottomComponent={scrollToBottomComponent}
          user={{
            _id: user.uid,
          }}
          onSend={text => onSend(text)}
          renderAvatar={() => (
            <Avatar.Image size={36} source={{uri: chatWith.photoURL}} />
          )}
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
              </>
            );
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
                }}
              />
            );
          }}
          renderSend={renderSend}
          renderInputToolbar={props => {
            return (
              <InputToolbar
                {...props}
                containerStyle={{
                  borderTopWidth: 1.5,
                  borderTopColor: 'purple',
                }}
                textInputStyle={{color: 'black', marginRight: 40}}
              />
            );
          }}
          renderCustomView={props => {
            if (props?.currentMessage?.fileUri) {
              return (
                <View
                  style={{
                    padding: 5,
                    margin: 5,
                    borderRadius: 10,
                  }}>
                  <TouchableOpacity
                    // onPress={() =>
                    //   checkPermission(props.currentMessage.fileUri)
                    // }
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
          }}
          renderMessageImage={props => {
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
          }}
        />
      </View>
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
    color: '#ffff',
    fontSize: 15,
  },
});
