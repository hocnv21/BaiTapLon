import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';

export default function MessageCard(props) {
  const {onPress} = props;
  return (
    <TouchableOpacity onPress={onPress}>
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
            source={require('../assets/micael.jpg')}
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
            <Text style={{fontSize: 25, fontWeight: 'bold'}}>
              Đoàn Thị Mỹ Linh
            </Text>
            <Text style={{fontWeight: 'bold', fontSize: 15}}>Chào bạn</Text>
          </View>

          <View
            style={{
              margin: 15,
            }}>
            <View style={{}}>
              <Text>2 phút</Text>
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
