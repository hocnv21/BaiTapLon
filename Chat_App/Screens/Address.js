import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IonsIcon from 'react-native-vector-icons/Ionicons';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {NavigationContainer} from '@react-navigation/native';

import Friend from './Friend';
import Group from './Group';

function Address() {
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
          }}>
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
            size={30}
            name="account-plus-outline"
          />
        </View>
      </View>
      {/* <NavigationContainer independent={true}> */}
      <TopTabs />
      {/* </NavigationContainer> */}
    </View>
  );
}
const Tab = createMaterialTopTabNavigator();
function TopTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Friend} />
      <Tab.Screen name="Settings" component={Group} />
    </Tab.Navigator>
  );
}
export default Address;
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffff',
  },
});
