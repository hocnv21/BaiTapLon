import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {CheckBox, Avatar} from '@rneui/themed';
import {useState} from 'react';

export default function UserCard(props) {
  const [check2, setCheck2] = useState(false);
  const {chatWith, room} = props;
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => navigation.navigate('Chat', {chatWith: chatWith, room})}>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: 'gray',
          backgroundColor: '#ffff',
        }}>
        <View style={{padding: 10, marginRight: 10}}>
          <Avatar size={50} rounded source={{uri: chatWith.photoURL}} />
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
            <Text style={{fontSize: 25, fontWeight: 'bold'}}>
              {chatWith.displayName}
            </Text>
          </View>

          <View
            style={{
              margin: 15,
            }}>
            {/* <CheckBox
              center
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checked={check2}
              onPress={() => setCheck2(!check2)}
            /> */}
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
