/* eslint-disable react-native/no-inline-styles */
import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';

export default function MessageCard(props) {
  const {chatWith, description, time, room} = props;
  const navigation = useNavigation();

  var t = new Date(time * 1000);
  var hours = t.getHours();
  var minutes = t.getMinutes();
  var newformat = t.getHours() >= 12 ? 'PM' : 'AM';
  // Find current hour in AM-PM Format
  hours = hours % 12;
  // To display "0" as "12"
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var formatted =
    //   ('0' + t.getHours()).slice(-2) +
    //   ':' +
    //   ('0' + t.getMinutes()).slice(-2) +
    //   ' ';
    // // +
    t.toString().split(' ')[0];
  +', ' +
    ('0' + t.getDate()).slice(-2) +
    '/' +
    ('0' + (t.getMonth() + 1)).slice(-2);
  +'/' + t.getFullYear();

  const onPressChat = () => {
    !chatWith.groupName
      ? navigation.navigate('Chat', {chatWith: chatWith, room})
      : navigation.navigate('ChatGroup', {chatWith: chatWith, room});
  };

  return (
    <TouchableOpacity onPress={() => onPressChat()}>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: 'gray',
        }}>
        <View style={{padding: 10, marginRight: 10}}>
          <Image
            style={{width: 70, height: 70, borderRadius: 50}}
            source={{uri: chatWith.photoURL}}
          />
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '100%',
          }}>
          <View style={{justifyContent: 'center'}}>
            <Text
              numberOfLines={1}
              style={{fontSize: 25, fontWeight: 'bold', width: 235}}>
              {chatWith.displayName ? chatWith.displayName : chatWith.groupName}
            </Text>
            <Text
              numberOfLines={1}
              style={{fontWeight: 'bold', fontSize: 15, width: 200}}>
              {description}
            </Text>
          </View>

          <View
            style={{
              margin: 15,
            }}>
            <View style={{}}>
              <Text>{formatted ? formatted : []}</Text>
            </View>

            <View
              style={{
                marginTop: 10,
                backgroundColor: '#EE5500',
                borderRadius: 10,
                alignItems: 'center',
              }}>
              <Text style={{color: '#ffff'}}>1</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
