import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {CheckBox, Avatar} from '@rneui/themed';
import {useState} from 'react';

export default function UserCardAddGroup(props) {
  const {chatWith, onPress, onDelete, room, check} = props;
  const navigation = useNavigation();
  const [check2, setCheck2] = useState(false);

  function handlePress() {
    if (check2 === true) {
      onDelete();
      setCheck2(false);
    }
    if (check2 === false) {
      onPress();
      setCheck2(true);
    }
  }

  return (
    <TouchableOpacity activeOpacity={1} onPress={() => handlePress()}>
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
            <Text
              numberOfLines={1}
              style={{fontSize: 25, fontWeight: 'bold', width: 235}}>
              {chatWith.displayName}
            </Text>
          </View>

          <View
            style={{
              margin: 15,
            }}>
            <CheckBox
              center
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checked={check2}
              disabled={true}
              //   onPress={() => setCheck2(!check2)}
            />
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
