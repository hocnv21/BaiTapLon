import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Appbar, Avatar, IconButton} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

export default function AppbarHeader({tittle}) {
  const navigation = useNavigation();
  return (
    <Appbar.Header style={{backgroundColor: '#0068FF'}}>
      <Appbar.BackAction onPress={() => navigation.goBack()} />

      <Appbar.Content title={tittle} />
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({});
