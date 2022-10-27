import {Button, StyleSheet, Text, View} from 'react-native';
import React from 'react';

export default function Account({user}) {
  // const signOut = () => {
  //   auth
  //     .signOut()
  //     .then(() => {
  //       navigation.replace('Login');
  //     })
  //     .catch(error => {});
  // };
  return (
    <View style={styles.container}>
      <Button title="Log Out" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffff',
    paddingTop: 35,
  },
});
