import {StyleSheet, Text, View} from 'react-native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';
import React from 'react';
import Message from './Message';
import Address from './Address';
import Account from './Account';

const Tab = createMaterialBottomTabNavigator();

export default function MyTabs({user, navigation}) {
  return (
    <Tab.Navigator
      initialRouteName="Message"
      activeColor="#1194FF"
      barStyle={{backgroundColor: '#F2F4F9'}}>
      <Tab.Screen
        name="Message"
        component={Message}
        options={{
          tabBarLabel: 'Tin nhắn',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="message" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Address"
        component={Address}
        options={{
          tabBarLabel: 'Danh bạ',
          tabBarIcon: ({color}) => (
            <FontAwesomeIcons name="address-book" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          tabBarLabel: 'Cá nhân',
          tabBarIcon: ({color}) => (
            <FontAwesomeIcons name="user" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});
