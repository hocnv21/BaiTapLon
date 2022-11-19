import React from 'react';
import {View, useColorScheme} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Login from './Screens/Login';
import Register from './Screens/Register';
import Account from './Screens/Account';
import Home from './Screens/Home';
import AppContext from './AppContext';
import Chat from './Screens/Chat';
import ChatGroup from './Screens/ChatGroup';
import AddGroup from './Screens/AddGroup';
import Search from './Screens/Search';
import SettingChat from './Screens/SettingScreen/SettingChat';

const Stack = createStackNavigator();
const StackAuth = () => {
  return (
    <Stack.Navigator initialRouteName="login">
      <Stack.Screen
        name="login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const StackHome = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SettingChat"
        component={SettingChat}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="AddGroup"
        component={AddGroup}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ChatGroup"
        component={ChatGroup}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Search"
        component={Search}
        options={{headerShown: false}}
      />

      <Stack.Screen name="Account">
        {props => <Account {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

const Navigator = () => {
  const scheme = useColorScheme();
  const [user, setUser] = React.useState(null);
  const [rooms, setRooms] = React.useState([]);
  const [unfilteredRooms, setUnfilteredRooms] = React.useState([]);

  function onAuthStateChanged(userlogin) {
    setUser(userlogin);
  }
  React.useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <AppContext.Provider
      value={{
        user: user,
        rooms,
        setRooms,
        unfilteredRooms,
        setUnfilteredRooms,
      }}>
      <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
        {/* <StatusBar barStyle="light-content" backgroundColor="green" /> */}
        <View style={{flex: 1}}>{!user ? <StackAuth /> : <StackHome />}</View>
      </NavigationContainer>
    </AppContext.Provider>
  );
};

export default Navigator;
