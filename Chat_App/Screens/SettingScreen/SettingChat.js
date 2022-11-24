import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Appbar, Avatar, IconButton} from 'react-native-paper';
import {Icon} from '@rneui/themed';
import SettingCard from '../../Components/SettingCard';

export default function SettingChat({route, navigation}) {
  const {chatWith, docid} = route.params;
  return (
    <>
      <Appbar.Header style={{backgroundColor: '#0068FF'}}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />

        <Appbar.Content title="Tuy Chon" />
      </Appbar.Header>
      <View style={styles.container}>
        <View>
          <Image style={styles.image} source={{uri: chatWith.photoURL}} />
        </View>
        <View>
          <Text style={{fontWeight: 'bold', fontSize: 25}}>
            {chatWith.displayName}
          </Text>
        </View>
        <SettingCard
          icon="image"
          tittle="Xem File phương tiện"
          onPress={() => navigation.navigate('StorageScreen', {docid: docid})}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
});
