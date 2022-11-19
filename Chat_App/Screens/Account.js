import {
  Button,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import Feather from 'react-native-vector-icons/Feather';
import firestore from '@react-native-firebase/firestore';
import AppContext from '../AppContext';

export default function Account() {
  const [profile, setProfile] = useState('');

  const {user} = React.useContext(AppContext);

  useEffect(() => {
    firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(docSnap => {
        setProfile(docSnap.data());
      });
  }, [user]);

  if (!profile) {
    return <ActivityIndicator size="large" color="#00ff00" />;
  }
  return (
    <View style={styles.container}>
      <Image style={styles.img} source={{uri: profile.photoURL}} />
      <Text style={styles.text}>Name - {profile.displayName}</Text>
      <View style={{flexDirection: 'row'}}>
        <Feather name="mail" size={30} color="white" />
        <Text style={[styles.text, {marginLeft: 10}]}>{profile.email}</Text>
      </View>

      <Button
        title="Log Out"
        onPress={() => {
          auth()
            .signOut()
            .then(() => console.log('User signed out!'));
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffff',
    flex: 1,
    justifyContent: 'center',
  },
  img: {
    width: 200,
    height: 200,
  },
});
