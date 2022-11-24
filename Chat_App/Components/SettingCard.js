import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {Icon} from '@rneui/themed';

export default function SettingCard({icon, tittle, onPress}) {
  return (
    <View style={{width: '100%', borderBottomWidth: 0.5}}>
      <TouchableOpacity
        onPress={onPress}
        style={{
          padding: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View style={{flexDirection: 'row'}}>
          <Icon name={icon} />
          <Text> {tittle} </Text>
        </View>

        <Icon name="chevron-right" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({});
