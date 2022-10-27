import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IonsIcon from 'react-native-vector-icons/Ionicons';
import React from 'react';
import MessageCard from './MessageCard';

export default function Message({navigation}) {
  const pressChat = () => {
    navigation.navigate('Chat');
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          width: '100%',
          height: 60,
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          backgroundColor: '#0068FF',
        }}>
        <TouchableOpacity
          activeOpacity={1}
          style={{
            flex: 1,
            backgroundColor: '#0068FF',
            height: 40,
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => navigation.navigate('Contacts')}>
          <IonsIcon
            activeOpacity={1}
            name="search-outline"
            size={25}
            style={{marginHorizontal: 10, color: '#ffff'}}
          />
          <Text style={{color: '#F8F5F5', fontSize: 16}}>Tìm kiếm</Text>
        </TouchableOpacity>

        <View>
          <MaterialCommunityIcons.Button
            backgroundColor={'#0068FF'}
            size={35}
            name="plus"
          />
        </View>
      </View>

      <View>
        <ScrollView>
          <MessageCard onPress={pressChat} />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffff',
    paddingTop: 35,
  },
});
