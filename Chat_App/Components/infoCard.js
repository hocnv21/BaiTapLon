import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {Icon} from '@rneui/themed';

export default function infoCard({tittle1, tittle2}) {
  return (
    <View style={{width: '100%', borderBottomWidth: 0.5}}>
      <TouchableOpacity
        onPress={{}}
        style={{
          padding: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View style={{flexDirection: 'row'}}>
          <Text> {tittle1} </Text>
        </View>

        <Text>{tittle2}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({});
