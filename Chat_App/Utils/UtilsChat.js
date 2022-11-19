import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React, {useState} from 'react';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

export const getAllUsers = async user => {
  const querySanp = await firestore()
    .collection('users')
    .where('uid', '!=', user.uid)
    .get();
  const result = querySanp.docs.map(docSnap => docSnap.data());

  return result;
};

const styles = StyleSheet.create({});
