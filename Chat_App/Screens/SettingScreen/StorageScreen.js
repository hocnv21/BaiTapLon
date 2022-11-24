import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import AppbarHeader from '../../Components/AppbarHeader';
import storage from '@react-native-firebase/storage';

export default function StorageScreen({route}) {
  const {docid} = route.params;
  const [image, setImage] = useState([]);

  async function getImage() {
    const result = await storage()
      .ref(`imageChatRooms/${docid}/`)
      .listAll()
      .then(value => {
        value.items.map(x => {
          storage()
            .ref(x.path)
            .getDownloadURL()
            .then(imageURL => {
              image.push(imageURL);
              setImage(image);
              console.log(image.length);
              console.log(image);
            });
        });
      });

    return result;
  }
  useEffect(() => {
    getImage();
  }, []);
  return (
    <>
      <AppbarHeader
        tittle="File và phương tiện "
        style={{backgroundColor: '#0068FF'}}
      />

      <View style={styles.container}>
        {/* {image.map(i => (
          <Image
            key={i}
            sourcr={{uri: i}}
            style={{width: 200, height: 200, resizeMode: 'cover'}}
          />
        ))} */}
        <Text>{image.length}</Text>
        <FlatList
          data={image}
          numColumns={2}
          renderItem={({item}) => {
            return (
              <Image
                style={{width: 200, height: 200, resizeMode: 'cover'}}
                source={{uri: item}}
              />
            );
          }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    flexWrap: 'wrap',
  },
});
