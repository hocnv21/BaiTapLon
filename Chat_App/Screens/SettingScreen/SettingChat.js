import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Appbar, Avatar, IconButton} from 'react-native-paper';

export default function SettingChat({route, navigation}) {
  const {chatWith} = route.params;
  return (
    <>
      <Appbar.Header>
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
