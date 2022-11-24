import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {Icon} from '@rneui/themed';

export default function ReplyFooter() {
  return (
    <View
      style={{
        flexDirection: 'row',
      }}>
      <View style={{width: 5, backgroundColor: 'red'}}></View>
      <View style={{flex: 1, flexDirection: 'column'}}>
        <Text
          style={{
            color: 'red',
            paddingLeft: 10,
            paddingTop: 5,
            fontWeight: 'bold',
          }}>
          {replyMsg?.replyTo}
        </Text>
        <Text
          style={{
            color: '#034f84',
            paddingLeft: 10,
            paddingTop: 5,
            marginBottom: 2,
          }}>
          {replyMsg.replyText}
        </Text>
      </View>
      <TouchableOpacity
        style={{}}
        onPress={() =>
          setReplyMsg({replyId: null, replyText: '', replyTo: null})
        }>
        <Icon name="x" type="feather" color="#0084ff" size={20} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({});
