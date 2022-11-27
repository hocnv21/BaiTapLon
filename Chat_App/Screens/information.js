/* eslint-disable react-hooks/rules-of-hooks */
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
import firestore from '@react-native-firebase/firestore';
import Feather from 'react-native-vector-icons/Feather';
import AppContext from '../AppContext';
import AppbarHeader from '../Components/AppbarHeader';
import infoCard from '../Components/infoCard';

export default function information({navigation}) {
  const [profile, setProfile] = useState('');

  const {user} = React.useContext(AppContext);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(docSnap => {
        setProfile(docSnap.data());
      });
  }, [user]);
  return (
    <>
      <AppbarHeader
        tittle="Thông tin cá nhân "
        style={{backgroundColor: '#0068FF'}}
      />
      <View style={styles.container}>
        <infoCard tittle1={profile.disPlayName} tittle2={profile.email} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
