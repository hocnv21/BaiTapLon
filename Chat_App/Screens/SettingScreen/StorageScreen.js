import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AppbarHeader from '../../Components/AppbarHeader';
import storage from '@react-native-firebase/storage';

export default function StorageScreen({route}) {
  const {docid} = route.params;
  const [refreshing, setRefreshing] = React.useState(false);
  const [image, setImage] = useState([]);
  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

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
              setRefreshing(false);
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
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getImage();
    wait(2000).then(() => {
      setRefreshing(false);
    });
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
        <TouchableOpacity
          style={{
            width: '100%',
            height: 30,
          }}></TouchableOpacity>

        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={image}
          numColumns={2}
          renderItem={({item, index}) => {
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
